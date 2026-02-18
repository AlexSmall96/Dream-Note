import { injectable, inject } from "inversify";
import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest, RequestWithUser } from "../interfaces/auth.interfaces.js";
import { AuthService } from "../services/auth.service.js";
export type purposeType = "email-update" | "password-reset"

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

    public getCurrAuth = async (req: Request, res: Response, next: NextFunction) => {
        const authReq = req as AuthenticatedRequest
        try {
            res.json({
                user: {
                    _id: authReq.user._id,
                    email: authReq.user.email
                }, 
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