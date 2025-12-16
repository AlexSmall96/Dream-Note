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
        }
        )

        // Log in
        this.router.post('/login', findByCredentials, async (req: RequestWithUser, res: Response, next: NextFunction) => {
            try {
                const result = await this.userController.handleLogIn(req.user);
                
                // Set Http cookie
                res.cookie('session', result.token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 1000 * 60 * 60 * 24, // 1 day
                })

                res.json(result) 
            } catch (err){
                next(err);
            }
        })

        // Return the currently authenticated user
        this.router.get('/auth/me', auth, (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            try {
                res.json({
                    _id: req.user._id,
                    email: req.user.email,
                })
            } catch (err){
                next(err)
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

        /* Send one time passcode (OTP) to email address
        Used to either verify an email address or reset password when logged out
        The code to validate and send to an email address was taken from the following article
        https://medium.com/@elijahechekwu/sending-emails-in-node-express-js-with-nodemailer-gmail-part-1-67b7da4ae04b
        */
        this.router.post('/sendOTP', async (req: Request, res: Response, next: NextFunction) => {

            // Get purpose, email and OTP from request body
            const {email, OTP, resetPassword, expiresIn} = req.body

            // Check if email and OTP are present
            if (!email || !OTP || !expiresIn){
                return res.status(400).send({error: "Please provide a OTP, email address and expiresIn value."})
            }
            try {

                // Check for account associated with email address
                const account = await this.userController.findUserByEmail(req.body.email)

                // If aim is to reset password, check if email address belongs to an account
                if (resetPassword && !account){
                    return res.status(400).send({ error: 'No account was found associated with the given email address.' });

                // If aim is to verify new email, check if email address has not yet been taken
                } else if (!resetPassword && account){
                    return res.status(400).send({ error: 'Email address taken. Please choose a different email address.' });
                }
                // Send email
                await this.emailService.sendMailWithData(resetPassword, email, OTP, expiresIn)
                res.json({ message: "OTP sent successfully." });
            } catch (err){
                next(err)
            }
        })

        // Update user details
        this.router.patch('/update', auth, signupOrUpdateValidator, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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
            try {
                const result = await this.userController.handleDeleteAccount(req.user._id);
                res.json(result) 
            } catch (err){
                next(err);
            }            
        })
    }
}