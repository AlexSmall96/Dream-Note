import { injectable } from "inversify";
import nodemailer from 'nodemailer';
import { purposeType } from "./otp.service.js";

// Email service class for password reset and email verification
@injectable()
export class EmailService {
    private transporter = nodemailer.createTransport({
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASS
        }
    }); 

    public sendMailWithData(purpose: purposeType, email: string, OTP: string, expiresIn: number, expiresInUnit: 'minutes' | 'hours' = 'minutes', onSignup: boolean = false) {
        
        const forEmailVer = purpose === 'email-verification'

        const onSignupText = 'Thank you for signing up to Dream Note.'
        const generalText = `Your one time passcode (OTP) is ${OTP}. This will expire in ${expiresIn} ${expiresInUnit}.`
        const emailVerText = 'Please visit the account page and enter this passcode to verify your email address.'

        const text = (onSignup? onSignupText + '\n' : '') + (generalText) + (forEmailVer ? '\n' + emailVerText : '')
        const subject = `Your Dream Note OTP for ${purpose}.`

        return this.transporter.sendMail({
            from: process.env.SMTP_MAIL,
            to: email,
            subject,
            text           
        })
    }

    public sendAccountDeletionConfirmation(email: string){
        const subject = 'Your Dream Note account has been deleted.'
        const text = 'Your account has been successfully deleted. We are sorry to see you go.'
        return this.transporter.sendMail({
            from: process.env.SMTP_MAIL,
            to: email,
            subject,
            text           
        })
    }
}
