import { Router, Request, Response, NextFunction } from "express";
import { UserController } from "../controllers/user.controller.js";
import { injectable, inject } from "inversify";
import { validationResult } from "express-validator";
import { signupValidator } from "../validators/signup.validator.js";

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
        this.router.post(
            '/signup', signupValidator, async (req: Request, res: Response, next: NextFunction) => {
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
    }
}