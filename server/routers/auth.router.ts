import { Router } from "express";
import { injectable, inject } from "inversify";
import { AuthController } from "../controllers/auth.controller.js";
import { auth } from "../middleware/auth.js";
import { signupOrUpdateValidator } from "../middleware/signupOrUpdate.validator.js";
import { findByCredentials } from "../middleware/findByCredentials.js";
import { validateRequest } from "../middleware/validateRequest.js";

// Router class for User model
@injectable()
export class AuthRouter {
    public router: Router


    // Inject AuthController
    constructor(
        @inject(AuthController) private authController: AuthController,
    ){
        this.router = Router();
        this.initializeRoutes();
    }

    // Routes
    private initializeRoutes(){
        // Sign up
        this.router.post('/signup', signupOrUpdateValidator, validateRequest, this.authController.signUp)
            
        // Log in
        this.router.post('/login', findByCredentials, this.authController.login)
            
        // Login to guest account
        this.router.post('/login-guest', this.authController.loginGuest)
            
        // Return the currently authenticated user
        this.router.get('/auth/me', auth, this.authController.getCurrAuth)
            
        // Logout 
        this.router.post('/logout', auth, this.authController.logout)   
    }
}