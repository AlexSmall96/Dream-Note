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

    public getTransporter() {
        return this.transporter;
    }
}
