import { injectable } from "inversify";
import nodemailer from 'nodemailer';

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

    public sendMailWithData(resetPassword: boolean, email: string, OTP: number, expiresIn: number) {
        return this.transporter.sendMail({
            from: process.env.SMTP_MAIL,
            to: email,
            subject: `Your Dream Note OTP for ${resetPassword? 'password reset': 'email address verification'}.`,
            text: `Your one time passcode (OTP) is ${OTP}. This will expire in ${expiresIn} minutes.`            
        })
    }
}
