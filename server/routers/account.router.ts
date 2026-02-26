import { Router } from "express";
import { injectable, inject } from "inversify";
import { AccountController } from "../controllers/account.controller.js";
import { auth } from "../middleware/users/auth.js";
import { signupOrUpdateValidator } from "../middleware/users/signupOrUpdate.validator.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { body } from "express-validator";
import { forbidGuest } from "../middleware/users/forbidGuest.js";
import { comparePasswords } from "../middleware/users/comparePasswords.js";
import { forbidUnverified } from "../middleware/users/forbidUnverified.js";

// Router class for User model
@injectable()
export class AccountRouter {
    public router: Router


    // Inject AccountController
    constructor(
        @inject(AccountController) private accountController: AccountController,
    ){
        this.router = Router();
        this.initializeRoutes();
    }

    // Routes
    private initializeRoutes(){

        // Request email update by sending OTP to new email address
        this.router.post(
            '/request-email-update', 
            auth,   
            body("email")
            .notEmpty().withMessage("Email required").bail()
            .isEmail().withMessage("Invalid email format"), 
            validateRequest, 
            this.accountController.requestEmailUpdate
        )

        // Request password by while unauthenticated sending OTP to existing email address
        this.router.post(
            '/request-password-reset',
            body("email")
            .notEmpty().withMessage("Email required").bail()
            .isEmail().withMessage("Invalid email format"),
            validateRequest,
            this.accountController.requestPasswordReset
        )

        this.router.post(
            '/request-email-verification',
            auth,
            forbidGuest('Guest users are not authorized to request email verification.'),
            this.accountController.requestEmailVerification
        )

        this.router.patch(
            '/verify-email',
            auth,
            forbidGuest('Guest users are not authorized to verify email.'),
            body('otp')
            .notEmpty().withMessage('Please provide the OTP that was sent to your email address.'),
            validateRequest,
            this.accountController.verifyEmail
        )

        // Verify otp and update email
        this.router.patch(
            '/update-email',
            auth,
            forbidGuest('Guest users are not authorized to update account details.'),
            body('otp')
            .notEmpty().withMessage('Please provide the OTP that was sent to your email address.'),
            validateRequest,
            this.accountController.updateEmail
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
            this.accountController.verifyResetOtp        
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
            this.accountController.resetPassword
        )

        // Update password while authenticated
        this.router.patch(
            '/update-password',
            auth,
            forbidGuest('Guest users are not authorized to update profile details.'),
            forbidUnverified('Please verify your email address to update your password.'),
            body('currPassword')
            .notEmpty().withMessage('Please provide current password to update.').bail(),
            body('password')
            .notEmpty().withMessage('Please provide new password to update.'),
            validateRequest, // Validate existence of currPassword and password
            comparePasswords, // Compare currPassword to saved password
            signupOrUpdateValidator, // Once currPassword is confirmed to be correct, then validate it for complexity requirements
            validateRequest, // Call validate request again with results of signupOrUpdateValidator
            this.accountController.updatePassword
        )

        // Delete account
        this.router.delete(
            '/delete',
            auth, 
            forbidGuest('Guest users are not authorized to delete account.'),
            forbidUnverified('Please verify your email address to delete your account.'),
            this.accountController.deleteAccount
        )
    }
}