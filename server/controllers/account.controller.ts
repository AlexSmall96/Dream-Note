import { injectable, inject } from "inversify";
import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../interfaces/auth.interfaces.js";
import { AccountService } from "../services/users/account.service.js";

export type purposeType = "email-update" | "password-reset"

// Controller clas for User model
@injectable()
export class AccountController {

    constructor(
        @inject(AccountService) private accountService: AccountService,
    ){}

    public requestEmailUpdate = async (req: Request, res: Response, next: NextFunction) => {
        const authReq = req as AuthenticatedRequest
        const email = authReq.body.email
        const userId = authReq.user._id.toString()
        try {
            await this.accountService.requestEmailUpdate(email, userId)
            res.json({ message: "A OTP (one time passcode) has been sent to your new email address." })
        } catch (err){
            next(err)
        }
    }

    // Send otp to existing email address 
    public requestPasswordReset = async (req: Request, res: Response, next: NextFunction) => {
        const email = req.body.email
        try {
            await this.accountService.requestPasswordReset(email)
            // Always return success message to prevent email enumeration, even if email doesn't exist or error occurs when sending OTP
            return res.json({ message: "If an account is associated with the provided email address, a OTP will be sent." })            
        } catch (err){
            next(err)
        }
    }

    public requestEmailVerification = async (req: Request, res: Response, next: NextFunction) => {
        const authReq = req as AuthenticatedRequest
        const email = authReq.user.email
        const userId = authReq.user._id.toString()
        try {
            await this.accountService.requestEmailVerification(email, userId)
            res.json({ message: "A OTP (one time passcode) has been sent to your email address." })
        } catch (err){
            next(err)
        }
    }

    public verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
        const authReq = req as AuthenticatedRequest
        const otp = authReq.body.otp
        const userId = authReq.user._id.toString()
        try {
            await this.accountService.verifyEmailAndDeleteOtp(otp, userId)
            res.json({message: 'Email verified successfully.'})
        } catch (err){
            next(err)
        }          
    }

    // Verify OTP and update email - requires OTP that was sent to new email address, and user must be authenticated to verify ownership of account
    public updateEmail = async (req: Request, res: Response, next: NextFunction) => {
        const authReq = req as AuthenticatedRequest
        const otp = authReq.body.otp
        const userId = authReq.user._id.toString()
        try {
            await this.accountService.updateEmailAndDeleteOtp(otp, userId)
            res.json({message: 'Email updated successfully.'})
        } catch (err){
            next(err)
        }        
    }

    // Verify otp for password reset, requires email that otp was sent to and otp value
    public verifyResetOtp = async (req: Request, res:Response, next: NextFunction) => {
        const otp = req.body.otp
        const email = req.body.email
        try {
            const resetToken = await this.accountService.verifyResetOtpAndSendToken(otp, email)
            res.json({ resetToken })
        } catch (err) {
            next(err)
        }
    }

    // Reset password for unauthenticated user using token from verified otp
    public resetPassword = async (req: Request, res:Response, next: NextFunction) => {
        const resetToken = req.body.resetToken
        const newPassword = req.body.password
        try {
            await this.accountService.resetPassword(resetToken, newPassword)
            res.json({ message: "Password updated successfully." })
        } catch (err){
            next(err)
        }
    }

    public updatePassword = async (req: Request, res:Response, next: NextFunction) => {
        const authReq = req as AuthenticatedRequest
        const newPassword = authReq.body.password
        const userId = authReq.user._id.toString()
        try {
            await this.accountService.updatePassword(newPassword, userId);
            res.json({message: 'Password updated successfully.'}) 
        } catch (err){
            next(err);
        } 
    }

    public deleteAccount = async (req: Request, res:Response, next: NextFunction) => {
        const authReq = req as AuthenticatedRequest
        const userId = authReq.user._id.toString()
        try {
            const result = await this.accountService.deleteAccount(userId);
            res.json(result) 
        } catch (err){
            next(err);
        }   
    }
}