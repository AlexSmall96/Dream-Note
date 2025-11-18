import { Router, Request, Response, NextFunction } from "express";
import { UserController } from "../controllers/user.controller.js";
import { injectable, inject } from "inversify";
import { validationResult } from "express-validator";
import { userValidator } from "../validators/user.validator.js";
import { auth, AuthenticatedRequest } from "../middleware/auth.js";

// Router class for User model
@injectable()
export class UserRouter {
    public router: Router


    // Inject UserController
    constructor(@inject(UserController) private userController: UserController){
        this.router = Router();
        this.initializeRoutes();
    }

    // Routes
    private initializeRoutes(){
        // Sign up
        this.router.post('/signup', userValidator, async (req: Request, res: Response, next: NextFunction) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            try {
                const user = await this.userController.handleSignUp(req.body);
                res.json(user)
            } catch (err){
                next(err);
            }
        }
        )

        // Log in
        this.router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const result = await this.userController.handleLogIn(req.body);
                res.json(result) 
            } catch (err){
                next(err);
            }
        })

        // Logout
        this.router.post('/logout', auth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            try {
                const result = await this.userController.handleLogOut(req);
                res.json(result) 
            } catch (err){
                next(err)
            }
        })


        // Update user details
        this.router.patch('/update', auth, userValidator, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            try {
                const result = await this.userController.handleUpdateProfile(req.body, req.user);
                res.json(result) 
            } catch (err){
                next(err);
            }            
        })

        // Delete account
        this.router.delete('/delete', auth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            try {
                const result = await this.userController.handleDeleteAccount(req.user);
                res.json(result) 
            } catch (err){
                next(err);
            }            
        })
    }
}