import { Router, Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { injectable, inject } from "inversify";
import bcrypt from "bcrypt";
import { UserController } from "../controllers/user.controller.js";
import { auth } from "../middleware/auth.js";
import { signupOrUpdateValidator } from "../middleware/signupOrUpdate.validator.js";
import { findByCredentials } from "../middleware/findByCredentials.js";
import { AuthenticatedRequest, RequestWithUser } from "../interfaces/auth.interfaces.js";
import { EmailService } from "../services/email.service.js";

const sessionCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 1000 * 60 * 60 * 24,
};

// Router class for User model
@injectable()
export class UserRouter {
    public router: Router


    // Inject UserController
    constructor(
        @inject(UserController) private userController: UserController,
        @inject(EmailService) private emailService: EmailService
    ){
        this.router = Router();
        this.initializeRoutes();
    }

    // Routes
    private initializeRoutes(){
        // Sign up
        this.router.post('/signup', signupOrUpdateValidator, async (req: Request, res: Response, next: NextFunction) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            try {
                const user = await this.userController.handleSignUp(req.body);
                res.status(201).json(user)
            } catch (err){
                next(err);
            }
        })

        // Log in
        this.router.post('/login', findByCredentials, async (req: RequestWithUser, res: Response, next: NextFunction) => {
            try {
                const result = await this.userController.handleLogIn(req.user);
                // Set Http cookie
                res.cookie('session', result.token, sessionCookieOptions)
                res.json(result) 
            } catch (err){
                next(err);
            }
        })

        // Login to guest account
        this.router.post('/login-guest', async (_req: Request, res: Response, next: NextFunction) => {
            try {
                const result = await this.userController.handleGuestLogIn();
                res.cookie('session', result.token, sessionCookieOptions)
                res.json(result)
            } catch (err) {
                next(err)
            }
        })

        // Return the currently authenticated user
        this.router.get('/auth/me', auth, (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            try {
                res.json({
                    user: {
                        _id: req.user._id,
                        email: req.user.email
                    }, 
                    isGuest: req.isGuest
                })
            } catch (err){
                next(err)
            }
        })

    
        // Logout 
        this.router.post('/logout', auth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            try {
                await this.userController.handleLogOut(req);
                res.json({message: 'Logged out successfully'}) 
            } catch (err){
                next(err)
            }
        })

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
                return res.json({ message: "If an account is associated with the provided email address, a OTP will be sent." })            
            } catch (err){
                next(err)
            }
        })

        // Update user details
        this.router.patch('/update', auth, signupOrUpdateValidator, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            if (req.isGuest){
                return res.status(403).send({error: 'Guest users are not authorized to update profile details.'})
            }
            // Check if password has been supplied and current password is correct
            const currPassword = req.body.currPassword
            const newPassword = req.body.password
            if (currPassword && newPassword){
                const isMatch: boolean = await bcrypt.compare(req.body.currPassword, req.user.password)
                if (!isMatch) {
                    return res.status(400).send({errors: [{param: 'currPassword', msg: 'Current password incorrect.'}]})
                }
            }
            if (!currPassword && newPassword){
                return res.status(400).send({errors: [{param: 'currPassword', msg: 'Please provide current password to update.'}]})
            }
            // Validate new details
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            // Save new details
            try {
                const result = await this.userController.handleUpdateProfile(req.body, req.user);
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