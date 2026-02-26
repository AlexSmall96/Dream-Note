import nodemailer from 'nodemailer';
import * as otpUtils from "../../../services/utils/otp.js";
import request from 'supertest';
import { wipeDB } from '../../setup/wipeDB.js'
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { baseUrl } from '../data.js';
import { createUser } from '../utils/userCreation.js';
import { userOneCreds } from '../data.js';
import { assertSingleError } from '../utils/assertErrors.js';
import bcrypt from "bcrypt";

let userOneId: string

// Wipe db and save data
beforeEach(async () => {
    await wipeDB()
    // Create a user to test success for valid email address
    const userOne = await createUser(userOneCreds)
    userOneId = userOne._id.toString()
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


const url = baseUrl + '/request-password-reset'

// Tests

describe('Requesting password reset should fail if:', () => {
    test('Email is not provided.', async () => {
        const response = await request(server).post(url).send({}).expect(400)
        assertSingleError(response.body.errors, 'Email required', 'email')
    })

    test('Email is not associated with any user. Message is still sent to avoid email enumeration.', async () => {
        const sendMailMock = nodemailer.createTransport().sendMail;
        // Use unsaved address - sendMailMock doesnt get called
        const response = await request(server).post(url).send({email: 'example@email.com'}).expect(200)
        expect(sendMailMock).toHaveBeenCalledTimes(0);
        // Feedback message is returned regardless of wether or not email was sent
        expect(response.body.message).toBe("If an account is associated with the provided email address, a OTP will be sent.")
    })

    test('Correct message is returned if email is provided.', async () => {
        const response = await request(server).post(url).send({email: 'example@email.com'}).expect(200)
        expect(response.body.message).toBe("If an account is associated with the provided email address, a OTP will be sent.")
    })
})

describe('Requesting password reset should succeed if:', async () => {
    test('Provided email address is associated with a user.', async () => {
        // Assert to otp is not saved in db yet
        const nullOtp = await Otp.find()
        expect(nullOtp).toHaveLength(0)   
        
        // Use userOne's email - a saved address to assert sendMailMock is called once
        const sendMailMock = nodemailer.createTransport().sendMail;
        const response = await request(server).post(url).send({email: userOneCreds.email}).expect(200)
        expect(response.body.message).toBe("If an account is associated with the provided email address, a OTP will be sent.")
        expect(sendMailMock).toHaveBeenCalledTimes(1);
        expect(sendMailMock).toHaveBeenCalledWith({
            from: process.env.SMTP_MAIL,
            to: userOneCreds.email,
            subject: `Your Dream Note OTP for password-reset.`,
            text: `Your one time passcode (OTP) is 123456. This will expire in 10 minutes.`            
        })    

        // Otp should now be saved in db
        const otpRecords = await Otp.find({
            userId: userOneId,
            email: userOneCreds.email,
            purpose: 'password-reset',
            used: false
        })
        expect(otpRecords).toHaveLength(1)
        const hashedOtp = otpRecords[0].otp
        const isMatch = await bcrypt.compare('123456', hashedOtp)
        expect(isMatch).toBe(true)
    })
})




