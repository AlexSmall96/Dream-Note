import { Router, Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { injectable, inject } from "inversify";
import { UserController } from "../controllers/user.controller.js";
import { auth } from "../middleware/auth.js";
import { signupOrUpdateValidator } from "../middleware/signupOrUpdate.validator.js";
import { findByCredentials } from "../middleware/findByCredentials.js";
import { AuthenticatedRequest, RequestWithUser } from "../interfaces/auth.interfaces.js";

const sessionCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 1000 * 60 * 60 * 24,
};

// Router class for User model
@injectable()
export class AuthRouter {
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
    }
}