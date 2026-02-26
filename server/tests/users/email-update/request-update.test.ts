import nodemailer from 'nodemailer';
import * as otpUtils from "../../../services/utils/otp.js";
import request from 'supertest';
import { wipeDB } from '../../setup/wipeDB.js'
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { baseUrl, userThreeCreds } from '../data.js';
import { createUser, getAuthHeader } from '../utils/userCreation.js';
import { userOneCreds } from '../data.js';
import { assertErrors, assertSingleError } from '../utils/assertErrors.js';
import bcrypt from "bcrypt";

let userOneAuth: [string, string]
let userOneId: string

// Wipe db and save data
beforeEach(async () => {
    await wipeDB()
    // Create a user to test success for valid email address
    const userOne = await createUser(userOneCreds)
    userOneAuth = getAuthHeader(userOne.tokens[0])
    userOneId = userOne._id.toString()
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
import { Otp } from '../../../models/OTP.model.js';


const url = baseUrl + '/request-email-update'

const newEmail = 'example@email.com'

// Tests

describe('Requesting email update should fail if:', () => {
    test('Email is not provided.', async () => {
        const response = await request(server).post(url).send({}).set(...userOneAuth).expect(400)
        assertSingleError(response.body.errors, 'Email required', 'email')
    })

    test('Provided email is taken.', async () => {
        const response = await request(server).post(url).send({email: userThreeCreds.email}).set(...userOneAuth).expect(400)
        assertErrors(response.body.errors, [{param: 'email', msg: 'Email address already in use.'}])
    })

    test('Email is already associated with current user.', async () => {
        const response = await request(server).post(url).send({email: userOneCreds.email}).set(...userOneAuth).expect(400)
        assertErrors(response.body.errors, [{param: 'email', msg: 'This email address is already associated with your account.'}])
    })

    test('User is not authenticated.', async () => {
        await request(server).post(url).send({email: newEmail}).expect(401)
    })
})

describe('Requesting email update should succeed if.', async () => {
    test('Provided address is not associated with any user. Otp should be saved in database.', async () => {
        // Assert to otp is not saved in db yet
        const nullOtp = await Otp.find()
        expect(nullOtp).toHaveLength(0)

        // Use an email that isn't saved to assert sendMailMock is called once
        const sendMailMock = nodemailer.createTransport().sendMail;
        const response = await request(server).post(url).send({email: newEmail}).set(...userOneAuth).expect(200)
        expect(response.body.message).toBe("A OTP (one time passcode) has been sent to your new email address.")
        expect(sendMailMock).toHaveBeenCalledTimes(1);
        expect(sendMailMock).toHaveBeenCalledWith({
            from: process.env.SMTP_MAIL,
            to: newEmail,
            subject: `Your Dream Note OTP for email-update.`,
            text: `Your one time passcode (OTP) is 123456. This will expire in 10 minutes.`            
        })  
        
        // Otp should now be saved in db
        const otpRecords = await Otp.find({
            userId: userOneId,
            email: newEmail,
            purpose: 'email-update',
            used: false
        })
        expect(otpRecords).toHaveLength(1)
        const hashedOtp = otpRecords[0].otp
        const isMatch = await bcrypt.compare('123456', hashedOtp)
        expect(isMatch).toBe(true)
    })

})