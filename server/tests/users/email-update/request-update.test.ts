import nodemailer from 'nodemailer';
import * as otpUtils from "../../../services/utils/otp.js";
import request from 'supertest';
import { wipeDB } from '../../setup/wipeDB.js'
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { baseUrl, userThreeCreds } from '../data.js';
import { createUser, getAuthHeader } from '../utils/userCreation.js';
import { userOneCreds } from '../data.js';
import { assertErrors, assertSingleError } from '../utils/assertErrors.js';

let userOneAuth: [string, string]

// Wipe db and save data
beforeEach(async () => {
    await wipeDB()
    // Create a user to test success for valid email address
    const userOne = await createUser(userOneCreds)
    userOneAuth = getAuthHeader(userOne.tokens[0])

    // Create a user to test failure for taken email address
    await createUser(userThreeCreds)
    vi.clearAllMocks() // Reset number of send mail calls
})

// Mock nodemailer with vi 
vi.mock("nodemailer", () => {
    // Mock sendMail function which is called by emailService
    const sendMail = vi.fn().mockResolvedValue(true);
    return {
        default: {
            createTransport: vi.fn(() => ({sendMail}))
        }
    }
})

// Mock generated OTP to assert correct email body
vi.spyOn(otpUtils, "generateOtp").mockReturnValue('123456');


// Import server after mock
import { server } from '../../setup/testServer.js'


const url = baseUrl + '/request-email-update'

const newEmail = 'example@email.com'

// Tests

describe('STATUS & FEEDBACK MESSAGES', () => {
    test('Error message should be returned if email is not provided.', async () => {
        const response = await request(server).post(url).send({}).set(...userOneAuth).expect(400)
        assertSingleError(response.body.errors, 'Email required', 'email')
    })

    test('Error message should be returned if email is taken.', async () => {
        const response = await request(server).post(url).send({email: userThreeCreds.email}).set(...userOneAuth).expect(400)
        assertErrors(response.body.errors, [{param: 'email', msg: 'Email address already in use.'}])
    })

    test('Error message should be returned if email is already associated with user.', async () => {
        const response = await request(server).post(url).send({email: userOneCreds.email}).set(...userOneAuth).expect(400)
        assertErrors(response.body.errors, [{param: 'email', msg: 'This email address is already associated with your account.'}])
    })

    test('Success message is returned if email is not taken.', async () => {
        const response = await request(server).post(url).send({email: newEmail}).set(...userOneAuth).expect(200)
        expect(response.body.message).toBe("OTP sent successfully.")
    })

    test('Sending email is unsucessful if user is not authenticated.', async () => {
        await request(server).post(url).send({email: newEmail}).expect(401)
    })
})

describe('EMAIL MOCKS.', async () => {
    test('Email is sent if provided address is not associated with a user.', async () => {
        const sendMailMock = nodemailer.createTransport().sendMail;
        // Use  an email that isn't saved to assert sendMailMock is called once
        await request(server).post(url).send({email: newEmail}).set(...userOneAuth).expect(200)
        expect(sendMailMock).toHaveBeenCalledTimes(1);
        expect(sendMailMock).toHaveBeenCalledWith({
            from: process.env.SMTP_MAIL,
            to: newEmail,
            subject: `Your Dream Note OTP for email-update.`,
            text: `Your one time passcode (OTP) is 123456. This will expire in 10 minutes.`            
        })    
    })

})