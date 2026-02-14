import { Router, Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { injectable, inject } from "inversify";
import bcrypt from "bcrypt";
import { UserController } from "../controllers/user.controller.js";
import { auth } from "../middleware/auth.js";
import { signupOrUpdateValidator } from "../middleware/signupOrUpdate.validator.js";
import { AuthenticatedRequest } from "../interfaces/auth.interfaces.js";

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
        this.router.post('/request-email-update', auth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            const { email } = req.body
            if (!email){
                return res.status(400).json({error: 'Email required'})
            }
            try {
                const existing = await this.userController.findUserByEmail(email)
                if (existing){
                    return res.status(400).json({
                        error: 'Email address taken'
                    })
                }
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
                return res.status(400).json({error: 'Email required'})
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

        // Update email after verifying OTP - requires OTP that was sent to new email address, and user must be authenticated to verify ownership of account
        this.router.patch('/update-email', auth, signupOrUpdateValidator, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            if (req.isGuest){
                return res.status(403).send({error: 'Guest users are not authorized to update profile details.'})
            }
            const otp = req.body.otp
            if (!otp){
                return res.status(400).json({error: 'Please provide the OTP that was sent to your email address.'})
            }   
            try {
                const otpRecord = await this.userController.handleFindOtp(otp, req.user._id.toString(), 'email-update')
                if (!otpRecord){
                    return res.status(400).json({error: 'Invalid or expired OTP.'})
                }
                await this.userController.handleUpdateEmail(otpRecord.email, req.user._id)
                otpRecord.used = true
                await otpRecord.save()
                res.json({message: 'Email updated successfully.'})
            } catch (err){
                next(err)
            }
        })

        // Update password - requires current password for verification, and new password that meets complexity requirements
        this.router.patch('/update-password', auth, signupOrUpdateValidator, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            if (req.isGuest){
                return res.status(403).send({error: 'Guest users are not authorized to update profile details.'})
            }
            // currPassword must be supplied to compare against password saved in db
            const currPassword = req.body.currPassword
            const newPassword = req.body.password
            if (!currPassword){
                return res.status(400).send({errors: [{param: 'currPassword', msg: 'Please provide current password to update.'}]})
            }
            if (!newPassword){
                return res.status(400).send({errors: [{param: 'password', msg: 'Please provide new password to update.'}]})
            }
            // currPassword and newPassword must be both provided to reach here
            const isMatch: boolean = await bcrypt.compare(req.body.currPassword, req.user.password)
            // currPassword must be correct to ensure user has permission to update it
            if (!isMatch) {
                return res.status(400).send({errors: [{param: 'currPassword', msg: 'Current password incorrect.'}]})
            }
            // Validate new passsword
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            try {
                const result = await this.userController.handleUpdatePassword(newPassword, req.user._id);
                res.json(result) 
            } catch (err){
                next(err);
            }            
        })

        // Delete account
        this.router.delete('/delete', auth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            if (req.isGuest){
                return res.status(403).send({error: 'Guest users are not authorized to delete account.'})
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