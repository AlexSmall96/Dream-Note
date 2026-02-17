import { Router, Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { injectable, inject } from "inversify";
import bcrypt from "bcrypt";
import { UserController } from "../controllers/user.controller.js";
import { auth } from "../middleware/auth.js";
import { signupOrUpdateValidator } from "../middleware/signupOrUpdate.validator.js";
import { AuthenticatedRequest } from "../interfaces/auth.interfaces.js";
import { formatError } from "../utils/formatError.js";
import jwt from "jsonwebtoken"

// Router class for User model
@injectable()
export class AccountRouter {
    public router: Router


    // Inject UserController
    constructor(
        @inject(UserController) private userController: UserController,
    ){
        this.router = Router();
        this.initializeRoutes();
    }

    // Routes
    private initializeRoutes(){
        // Request email update by sending OTP to new email address
        this.router.post('/request-email-update', auth, signupOrUpdateValidator, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            const { email } = req.body
            if (!email){
                return res.status(400).json(formatError('Email required', 'email'))
            }
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            try {
                await this.userController.handleSendOTP(email, 'email-update', req.user._id)
                res.json({ message: "OTP sent successfully." })
            } catch (err){
                next(err)
            }
        })

        // Request password reset by sending OTP to existing email address
        this.router.post('/request-password-reset', async (req: Request, res: Response, next: NextFunction) => {
            const { email } = req.body
            if (!email){
                return res.status(400).json(formatError('Email required', 'email'))
            }
            try {
                const existing = await this.userController.findUserByEmail(email)
                if (existing){
                    await this.userController.handleSendOTP(email, 'password-reset')
                }    
                // Always return success message to prevent email enumeration, even if email doesn't exist or error occurs when sending OTP
                return res.json({ message: "If an account is associated with the provided email address, a OTP will be sent." })            
            } catch (err){
                next(err)
            }
        })

        // Verify OTP and update email - requires OTP that was sent to new email address, and user must be authenticated to verify ownership of account
        this.router.patch('/update-email', auth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            if (req.isGuest){
                return res.status(403).json(formatError('Guest users are not authorized to update profile details.'))
            }
            const otp = req.body.otp
            if (!otp){
                return res.status(400).json(formatError('Please provide the OTP that was sent to your email address.', 'otp'))
            }   
            try {
                const otpRecord = await this.userController.handleFindOtpById(otp, 'email-update', req.user._id.toString())
                if (!otpRecord){
                    return res.status(400).json(formatError('Invalid or expired OTP.', 'otp'))
                }
                await this.userController.handleUpdateEmail(otpRecord.email, req.user._id)
                await this.userController.handleDeleteOtp(otpRecord._id.toString())
                res.json({message: 'Email updated successfully.'})
            } catch (err){
                next(err)
            }
        })

        // Verify otp for password reset, requires email that otp was sent to and otp value
        this.router.post('/verify-reset-otp', async (req: Request, res:Response, next: NextFunction) => {
            const otp = req.body.otp
            if (!otp){
                return res.status(400).json(formatError('Please provide the OTP that was sent to your email address.', 'otp'))
            }   
            const email = req.body.email
            if (!email){
                return res.status(400).json(formatError('Email must be provided to verify otp.', 'email'))
            }
            try {
                const otpRecord = await this.userController.handleFindOtpByEmailAndUpdate(otp, email, 'password-reset')
                if (!otpRecord){
                    return res.status(400).json(formatError('Invalid or expired OTP.', 'otp'))
                }
                const resetSecret = process.env.RESET_TOKEN_SECRET!
                if (!resetSecret){
                    throw new Error('RESET_TOKEN_SECRET is not configured.')
                }
                const resetToken = jwt.sign(
                    { userId: otpRecord.userId, otpId: otpRecord._id },
                    resetSecret,
                    { expiresIn: "10m" }
                )
                res.json({ resetToken })
            } catch (err) {
                next(err)
            }
        })
        
        // Reset password for unauthenticated user using token from verified otp
        this.router.patch('/reset-password', signupOrUpdateValidator, async (req: Request, res:Response, _next: NextFunction) => {
            const resetToken = req.body.resetToken
            if (!resetToken){
                return res.status(400).json(formatError('Reset token must be provided.', 'resetToken'))
            }
            const newPassword = req.body.password
            if (!newPassword){
                return res.status(400).json(formatError('New password must be provided.', 'password'))
            }
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const resetSecret = process.env.RESET_TOKEN_SECRET
            if (!resetSecret){
                throw new Error('RESET_TOKEN_SECRET is not configured.')
            }
            try {
                const payload = jwt.verify(
                    resetToken,
                    resetSecret
                ) as { userId: string, otpId: string}
            const {userId, otpId} = payload
            const user = await this.userController.findUserById(userId)
            if (!user) {
                return res.status(400).json(formatError('Invalid reset session.', 'resetToken'))
            }
            const otp = await this.userController.handleFindUsedOtp(otpId, userId, 'password-reset')
            
            if (!otp){
                return res.status(400).json(formatError('Invalid reset session.', 'resetToken'))
            }
            await this.userController.handleDeleteOtp(otpId)
            await this.userController.handleUpdatePassword(newPassword, userId)
            res.json({ message: "Password updated successfully." })
            } catch (err){
                return res.status(400).json(formatError('Invalid or expired reset session.', 'resetToken'))
            }
        })


        // Update password - requires current password for verification, and new password that meets complexity requirements
        this.router.patch('/update-password', auth, signupOrUpdateValidator, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            if (req.isGuest){
                return res.status(403).json(formatError('Guest users are not authorized to update profile details.'))
            }
            // currPassword must be supplied to compare against password saved in db
            const currPassword = req.body.currPassword
            const newPassword = req.body.password
            if (!currPassword){
                return res.status(400).json(formatError('Please provide current password to update.', 'currPassword'))
            }
            if (!newPassword){
                return res.status(400).json(formatError('Please provide new password to update.', 'password'))
            }
            // currPassword and newPassword must be both provided to reach here
            const isMatch: boolean = await bcrypt.compare(req.body.currPassword, req.user.password)
            // currPassword must be correct to ensure user has permission to update it
            if (!isMatch) {
                return res.status(400).json(formatError('Current password is incorrect.', 'currPassword'))
            }
            // Validate new passsword
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            try {
                await this.userController.handleUpdatePassword(newPassword, req.user._id);
                res.json({message: 'Password updated successfully.'}) 
            } catch (err){
                next(err);
            }            
        })

        // Delete account
        this.router.delete('/delete', auth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            if (req.isGuest){
                return res.status(403).json(formatError('Guest users are not authorized to delete account.'))
            }
            try {
                const result = await this.userController.handleDeleteAccount(req.user._id);
                res.json(result) 
            } catch (err){
                next(err);
            }            
        })
    }
}