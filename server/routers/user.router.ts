import { Router, Request, Response, NextFunction } from "express";
import { UserController } from "../controllers/user.controller.js";
import { injectable, inject } from "inversify";
import { validationResult } from "express-validator";
import { userValidator } from "../validators/user.validator.js";
import { auth } from "../middleware/auth.js";
import { AuthenticatedRequest } from "../interfaces/auth.interfaces.js";
import bcrypt from "bcrypt";
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

        /* Send one time passcode (OTP) to email address
        Used to either verify an email address or reset password when logged out
        The code to validate and send to an email address was taken from the following article
        https://medium.com/@elijahechekwu/sending-emails-in-node-express-js-with-nodemailer-gmail-part-1-67b7da4ae04b
        */
        this.router.post('/sendOTP', async (req: Request, res: Response, next: NextFunction) => {

            // Get purpose, email and OTP from request body
            const {email, OTP, resetPassword} = req.body

            // Check if email and OTP are present
            if (!email || !OTP){
                return res.status(400).send({error: "Please provide a OTP and email address."})
            }
            try {

                // Check for account associated with email address
                const account = await this.userController.findUserByEmail(req.body.email)

                // If aim is to reset password, check if email address belongs to an account
                if (resetPassword && !account){
                    return res.status(404).send({ error: 'No account was found associated with the given email address.' });

                // If aim is to verify new email, check if email address has not yet been taken
                } else if (!resetPassword && account){
                    return res.status(400).send({ error: 'Email address taken. Please choose a different email address.' });
                }

                // Configure email options
                const transporter = this.emailService.getTransporter();
                const purpose = resetPassword? 'password reset' : 'email address verification'
                
                const mailOptions = {
                    from: process.env.SMTP_MAIL,
                    to: email,
                    subject: `Your Dream Note OTP for ${purpose}.`,
                    text: `Your one time passcode (OTP) is ${OTP}. This will expire in 10 minutes.`
                };

                // Send email
                await transporter.sendMail(mailOptions)
                res.json({ message: "OTP sent successfully." });

            } catch (err){
                next(err)
            }
        })

        // Update user details
        this.router.patch('/update', auth, userValidator, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            // Check if password has been supplied and current password is correct
            const currPassword = req.body.currPassword
            if (currPassword){
                const isMatch: boolean = await bcrypt.compare(req.body.currPassword, req.user.password)
                if (!isMatch) {
                    return res.status(400).send({errors: {password: {message: 'Current password incorrect.'}}})
                }
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