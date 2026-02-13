import nodemailer from 'nodemailer';
import * as otpUtils from "../../services/utils/otp.js";
import request from 'supertest';
import { wipeDB } from '../setup/wipeDB.js'
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { baseUrl } from './data.js';
import { createUser } from './utils/userCreation.js';
import { userOneCreds } from './data.js';

// Wipe db and save data
beforeEach(async () => {
    await wipeDB()
    // Create a user to test success for valid email address
    await createUser(userOneCreds)
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
import { server } from '../setup/testServer.js'

const url = baseUrl + '/request-password-reset'

// Tests

describe('STATUS & FEEDBACK MESSAGES', () => {
    test('Error message should be returned if email is not provided.', async () => {
        const response = await request(server).post(url).send({}).expect(400)
        expect(response.body.error).toBe('Email required')
    })

    test('Correct message is returned if email is provided.', async () => {
        const response = await request(server).post(url).send({email: 'example@email.com'}).expect(200)
        expect(response.body.message).toBe("If an account is associated with the provided email address, a OTP will be sent.")
    })
})

describe('EMAIL MOCKS.', async () => {
    test('Email is sent if provided address is associated with a user.', async () => {
        const sendMailMock = nodemailer.createTransport().sendMail;
        // Use userOne's email - a saved address to assert sendMailMock is called once
        await request(server).post(url).send({email: userOneCreds.email}).expect(200)
        expect(sendMailMock).toHaveBeenCalledTimes(1);
        expect(sendMailMock).toHaveBeenCalledWith({
            from: process.env.SMTP_MAIL,
            to: userOneCreds.email,
            subject: `Your Dream Note OTP for password-reset.`,
            text: `Your one time passcode (OTP) is 123456. This will expire in 10 minutes.`            
        })    
    })

    test('Email is not sent if provided address is not associated with a user.', async () => {
        const sendMailMock = nodemailer.createTransport().sendMail;
        // Use unsaved address - sendMailMock doesnt get called
        await request(server).post(url).send({email: 'example@email.com'}).expect(200)
        expect(sendMailMock).toHaveBeenCalledTimes(0);
    })
})




