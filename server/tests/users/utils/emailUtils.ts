import { expect } from 'vitest';
import { EmailService } from "../../../services/email.service.js";
import { MailSlurp } from 'mailslurp-client';
import { purposeType } from '../../../controllers/auth.controller.js';

// Create instance of EmailService
const emailService = new EmailService()

// Create new instance of MailSlurp
const mailslurp = new MailSlurp({ apiKey: process.env.MAIL_SLURP_API_KEY || '' });

// Function to send email using transporter and assert data is correct
export const sendAndAssertEmail = async (purpose: purposeType, OTP: string, expiresIn: number) => {
    // Create inbox with mailslurp
    const inbox = await mailslurp.inboxController.createInboxWithDefaults();
    // Send email using transporter
    await emailService.sendMailWithData(purpose, inbox.emailAddress, OTP, expiresIn)
    // Recieve email with mailslurp
    const email = await mailslurp.waitForLatestEmail(
        inbox.id, 120_000, true
    )
    // Assert body, subject, to and from are correct
    expect(email.body).toContain(`Your one time passcode (OTP) is ${OTP}. This will expire in ${expiresIn} minutes.`)
    expect(email.subject).toBe(`Your Dream Note OTP for ${purpose}`)
    expect(email.from).toBe(process.env.SMTP_MAIL)
    expect(email.to[0]).toBe(inbox.emailAddress)
}