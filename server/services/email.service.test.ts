import { expect, test } from "vitest";
import { EmailService } from "./email.service";
import { MailSlurp } from 'mailslurp-client';

// Create instance of EmailService
const emailService = new EmailService()

// Create new instance of MailSlurp
const mailslurp = new MailSlurp({ apiKey: process.env.MAIL_SLURP_API_KEY || '' });

// Function to send email using transporter and assert data is correct
const sendAndAssertEmail = async (resetPassword: boolean, OTP: number, expiresIn: number) => {
    // Create inbox with mailslurp
    const inbox = await mailslurp.inboxController.createInboxWithDefaults();
    // Send email using transporter
    await emailService.sendMailWithData(resetPassword, inbox.emailAddress, OTP, expiresIn)
    // Recieve email with mailslurp
    const email = await mailslurp.waitForLatestEmail(
        inbox.id, 120_000, true
    )
    // Assert body, subject, to and from are correct
    expect(email.body).toContain(`Your one time passcode (OTP) is ${OTP}. This will expire in ${expiresIn} minutes.`)
    expect(email.subject).toBe(`Your Dream Note OTP for ${resetPassword? 'password reset': 'email address verification'}`)
    expect(email.from).toBe(process.env.SMTP_MAIL)
    expect(email.to[0]).toBe(inbox.emailAddress)
}

// Tests

test('Email should be sent with correct data for password reset.', async () => {
    sendAndAssertEmail(true, 123456, 10)
})
test('Email should be sent with correct data for email address update.', async () => {
    sendAndAssertEmail(false, 358652, 5)
})


