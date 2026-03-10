import { injectable, inject } from "inversify";
import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest, RequestWithUser } from "../interfaces/auth.interfaces.js";
import { AuthService } from "../services/users/auth.service.js";

const sessionCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 1000 * 60 * 60 * 24,
};

// Controller clas for User model
@injectable()
export class AuthController {

    constructor(
        @inject(AuthService) private authService: AuthService,
    ){}

    // Sign up
    public signUp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await this.authService.signUp(req.body)
            res.status(201).json(user)
        } catch (err){
            console.log(err)
            next(err)
        }
    }
    
    // Log in
    public login = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const result = await this.authService.login(req.user);
            // Set Http cookie
            res.cookie('session', result.token, sessionCookieOptions)
            res.json(result) 
        } catch (err){
            next(err);
        }
    }

    public loginGuest = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.authService.loginGuest();
            // Set Http cookie
            res.cookie('session', result.token, sessionCookieOptions)
            res.json(result)
        } catch (err) {
            next(err)
        }
    }

    // Send otp to existing email address 
    public requestPasswordReset = async (req: Request, res: Response, next: NextFunction) => {
        const email = req.body.email
        try {
            await this.authService.requestPasswordReset(email)
            // Always return success message to prevent email enumeration, even if email doesn't exist or error occurs when sending OTP
            return res.json({ message: "If an account is associated with the provided email address, a OTP will be sent." })            
        } catch (err){
            next(err)
        }
    }

    // Verify otp for password reset, requires email that otp was sent to and otp value
    public verifyResetOtp = async (req: Request, res:Response, next: NextFunction) => {
        const otp = req.body.otp
        const email = req.body.email
        try {
            const resetToken = await this.authService.verifyResetOtpAndSendToken(otp, email)
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
            await this.authService.resetPassword(resetToken, newPassword)
            res.json({ message: "Password updated successfully." })
        } catch (err){
            next(err)
        }
    }


    public getCurrAuth = async (req: Request, res: Response, next: NextFunction) => {
        const authReq = req as AuthenticatedRequest
        const user = authReq.user
        const { _id, email, isVerified } = user
        try {
            res.json({
                user: { _id, email, isVerified }, 
                isGuest: authReq.isGuest
            })
        } catch (err){
            next(err)
        }
    }

    public logout = async (req: Request, res: Response, next: NextFunction) => {
        const authReq = req as AuthenticatedRequest
        try {
            await this.authService.logout(authReq.user, authReq.token);
            res.json({message: 'Logged out successfully'}) 
        } catch (err){
            next(err)
        }
    }
}