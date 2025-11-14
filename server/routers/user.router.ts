import { Router, Request, Response } from "express";
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
    }
}