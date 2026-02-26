import nodemailer from 'nodemailer';
import * as otpUtils from "../../../services/utils/otp.js";
import request from 'supertest';
import { wipeDB } from '../../setup/wipeDB.js'
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { baseUrl, guestUserCreds, userThreeCreds } from '../data.js';
import { createUser, getAuthHeader } from '../utils/userCreation.js';
import { userOneCreds } from '../data.js';
import { assertSingleError } from '../utils/assertErrors.js';
import { Otp } from '../../../models/OTP.model.js';
import bcrypt from "bcrypt";

let userOneId: string
let userOneAuth: [string, string]
let userThreeAuth: [string, string]
let guestUserAuth: [string, string]

// Wipe db and save data
beforeEach(async () => {
    await wipeDB()

    // Create a user to test success for unverified email
    const userOne = await createUser({...userOneCreds, isVerified: false})
    userOneAuth = getAuthHeader(userOne.tokens[0])
    userOneId = userOne._id.toString()
    // Create a user to test failure for already verified email
    const userThree = await createUser(userThreeCreds)
    userThreeAuth = getAuthHeader(userThree.tokens[0])

    // Create a guest user to test failure for guest account
    const guestUser = await createUser({...guestUserCreds, isGuest: true})
    guestUserAuth = getAuthHeader(guestUser.tokens[0])

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


const url = baseUrl + '/request-email-verification'

describe('Requesting email verification should fail if:', () => {
    test('User is authenticated as guest.', async () => {
        const response = await request(server).post(url).set(...guestUserAuth).expect(403)
        assertSingleError(response.body.errors, 'Guest users are not authorized to request email verification.')
    })

    test('Email is already verified.', async () => {
        const response = await request(server).post(url).set(...userThreeAuth).expect(400)
        assertSingleError(response.body.errors, 'Email address is already verified.')
    })
})

describe('Requesting email verification should succeed if:', () => {
    test('User is authenticated and email is unverified. OTP email should be sent.', async () => {
        // Assert to otp is not saved in db yet
        const nullOtp = await Otp.find()
        expect(nullOtp).toHaveLength(0)

        // Send email
        const sendMailMock = nodemailer.createTransport().sendMail;
        const response = await request(server).post(url).set(...userOneAuth).expect(200)
        expect(response.body.message).toBe("A OTP (one time passcode) has been sent to your email address.")
        expect(sendMailMock).toHaveBeenCalledTimes(1)
        expect(sendMailMock).toHaveBeenCalledWith({
            from: process.env.SMTP_MAIL,
            to: userOneCreds.email,
            subject: `Your Dream Note OTP for email-verification.`,
            text: `Your one time passcode (OTP) is 123456. This will expire in 24 hours.`            
        }) 
        
        // Otp should now be saved in db
        const otpRecords = await Otp.find({
            userId: userOneId,
            email: userOneCreds.email,
            purpose: 'email-verification',
            used: false
        })
        expect(otpRecords).toHaveLength(1)
        const hashedOtp = otpRecords[0].otp
        const isMatch = await bcrypt.compare('123456', hashedOtp)
        expect(isMatch).toBe(true)
    })
})
