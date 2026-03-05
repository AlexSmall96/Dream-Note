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
        return this.transporter.sendMail({
            from: process.env.SMTP_MAIL,
            to: email,
            subject: `Your Dream Note OTP for ${purpose}.`,
            text: `${onSignup? 'Thank you for signing up to Dream Note. ': ''}Your one time passcode (OTP) is ${OTP}. This will expire in ${expiresIn} ${expiresInUnit}.`            
        })
    }
}
