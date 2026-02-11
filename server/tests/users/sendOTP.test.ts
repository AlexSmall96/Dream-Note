import nodemailer from 'nodemailer';

import request from 'supertest';
import { wipeDB } from '../setup/wipeDB.js'
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { baseUrl } from './data.js';
import { createUser } from './utils/userCreation.js';
import { userFourCreds, userOneCreds } from './data.js';

// Wipe db and save data
beforeEach(async () => {
    await wipeDB()

    // Create a user to test failure for taken email address
    await createUser(userFourCreds)
    // Create a user to test success for valid email address
    await createUser(userOneCreds)
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

// Import server after mock
import { server } from './../setup/testServer.js'

const url = baseUrl + '/sendOTP'

// Send OTP for password reset or email verification
// The below tests mock nodemailer and do not send an email
// The purpose of this test file is to assert request data is appropriately validated and error/success messages are returned
describe('SEND OTP FAILURE', () => {
    
    test('Send OTP fails if email address, OTP or expiresIn are missing.', async () => {
        // Expected error message
        const expErrorMsg = "Please provide a OTP, email address and expiresIn value."
        // Define 3 request bodies, each with a missing parameter
        const reqBodies = [
            {email: 'user4@email.com', expiresIn: 10},
            {OTP: 123456, expiresIn: 10},
            {email: 'user4@email.com', OTP: 123456}
        ]
        // Send each request, error message should be returned for each one
        await Promise.all(reqBodies.map(async (body) => {
            const response = await request(server).post(url).send(body).expect(400)
            expect(response.body.error).toBe(expErrorMsg)
        }))
    })

    test('Send OTP for password reset fails if email address is not associated with an account.', async () => {
        // Send data with unused email address
        const response = await request(server).post(url).send({
            email: 'user5@email.com',
            OTP: 123456,
            resetPassword: true,
            expiresIn: 10,
        }).expect(400)
        // Correct error message is recieved
        expect(response.body.error).toBe('No account was found associated with the given email address.')
    })

    test('Send OTP for update email address fails if email address is taken.', async () => {
        // Send data with taken email address
        const response = await request(server).post(url).send({
            email: 'user4@email.com',
            OTP: 123456,
            resetPassword: false,
            expiresIn: 10,
        }).expect(400)
        // Correct error message is recieved
        expect(response.body.error).toBe('Email address taken. Please choose a different email address.')
    })
})

describe('SEND OTP SUCCESS', () => {
    test("Send OTP is successful if correct data is sent.", async () => {
        // Extract mocked sendMail property
        const sendMailMock = nodemailer.createTransport().sendMail;
        // Send data to reset password
        const response = await request(server).post(url).send({
            email: 'user1@email.com',
            OTP: 123456,
            resetPassword: true,
            expiresIn: 10,
        }).expect(200)
        // Correct message should be returned
        expect(response.body.message).toBe( "OTP sent successfully.")
        // Assertions about sendMailMock calls and data 
        expect(sendMailMock).toHaveBeenCalledTimes(1);
        expect(sendMailMock).toHaveBeenCalledWith({
            from: process.env.SMTP_MAIL,
            to: 'user1@email.com',
            subject: `Your Dream Note OTP for password reset.`,
            text: `Your one time passcode (OTP) is 123456. This will expire in 10 minutes.`            
        })
    })
})