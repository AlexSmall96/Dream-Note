import { Router, Request, Response, NextFunction } from "express";
import { UserController } from "../controllers/user.controller.js";
import { injectable, inject } from "inversify";

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
        this.router.post('/signup', async (req: Request, res: Response) => {
            try {
                const user = await this.userController.handleSignUp(req.body);
                res.json(user)
            } catch (err){
                res.send(err)
            }
        })

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