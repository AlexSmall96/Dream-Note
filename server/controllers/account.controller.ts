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