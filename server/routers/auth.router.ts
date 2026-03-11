import { Router } from "express";
import { injectable, inject } from "inversify";
import { AuthController } from "../controllers/auth.controller.js";
import { auth } from "../middleware/users/auth.js";
import { signupOrUpdateValidator } from "../middleware/users/signupOrUpdate.validator.js";
import { findByCredentials } from "../middleware/users/findByCredentials.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { body } from "express-validator";

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
        
        // Request password by while unauthenticated sending OTP to existing email address
        this.router.post(
            '/request-password-reset',
            body("email")
            .notEmpty().withMessage("Email required").bail()
            .isEmail().withMessage("Invalid email format"),
            validateRequest,
            this.authController.requestPasswordReset
        )    

        // Verify password reset otp to generate a reset token
        this.router.post(
            '/verify-reset-otp',
            body("otp")
            .notEmpty().withMessage('Please provide the OTP that was sent to your email address.').bail(),
            validateRequest,  
            body('email')
            .notEmpty().withMessage('Email must be provided to verify otp.'),
            validateRequest,  
            this.authController.verifyResetOtp        
        )

        // A seperate route is required for token verification only
        // This prevents users accessing reset password form with a fake token in the url
        this.router.post(
            '/verify-token',
            body('resetToken')
            .notEmpty().withMessage('Reset token must be provided.').bail(),
            validateRequest,
            this.authController.verifyResetToken
        )
        
        // Resets password using reset token
        this.router.patch(
            '/reset-password',
            body('resetToken')
            .notEmpty().withMessage('Reset token must be provided.').bail(),
            body('password')
            .notEmpty().withMessage('New password must be provided.'),
            signupOrUpdateValidator, 
            validateRequest,
            this.authController.resetPassword
        )

        // Return the currently authenticated user
        this.router.get('/me', auth, this.authController.getCurrAuth)
            
        // Logout 
        this.router.post('/logout', auth, this.authController.logout)   
    }
}