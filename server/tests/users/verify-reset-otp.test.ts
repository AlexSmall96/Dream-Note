import { wipeDB } from '../setup/wipeDB.js'
import { beforeEach, describe, expect, test } from 'vitest';
import { baseUrl } from './data.js';
import { createUser } from './utils/userCreation.js';
import { userOneCreds } from './data.js';
import { server } from '../setup/testServer.js'
import { postDataWithNoAuth } from './utils/sendData.js';
import { Otp } from '../../models/OTP.model.js';
import jwt from "jsonwebtoken"
import { Types } from 'mongoose';

let userOneId: Types.ObjectId
let validOtpId: Types.ObjectId

beforeEach(async () => {
    await wipeDB()

    // Create a user to test valid otp
    const userOne = await createUser(userOneCreds)
    userOneId = userOne._id

    // Save 2 otps one for password-reset and one for email-update to test valid purpose
    const validOtp = await new Otp({
        userId: userOne._id,
        email: userOneCreds.email,
        otp: '123456',
        purpose: 'password-reset',
        expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    }).save()
    validOtpId = validOtp._id

    await new Otp({
        userId: userOne._id,
        email: userOneCreds.email,
        otp: '112233',
        purpose: 'email-update',
        expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    }).save()
})  

const url = baseUrl + '/verify-reset-otp'

// Tests

describe('Verifying reset otp should fail if:', () => {
    test('Otp value is missing from request body.', async () => {
        const response = await postDataWithNoAuth(server, url, {email: userOneCreds.email}, 400)
        expect(response.body.error).toBe('Please provide the OTP that was sent to your email address.')
    })

    test('Email is missing from request body.', async () => {
        const response = await postDataWithNoAuth(server, url, {otp: '554433'}, 400)
        expect(response.body.error).toBe('Email must be provided to verify otp.')
    })

    test('Otp associated with email could not be found.', async () => {
        const response = await postDataWithNoAuth(server, url, {otp: '123456', email: 'someone@email.com'}, 400)
        expect(response.body.error).toBe('Invalid or expired OTP.')
    })

    test('Otp associated with email is found but purpose is update-email.', async () => {
        const response = await postDataWithNoAuth(server, url, {otp: '112233', email: userOneCreds.email}, 400)
        expect(response.body.error).toBe('Invalid or expired OTP.')
    })
})

describe('Verifying reset otp should succeed if:', () => {
    test('Email and provided otp value are associated with a valid otp record.', async () => {
        const response = await postDataWithNoAuth(server, url, {otp: '123456', email: userOneCreds.email}, 200)
        // Reset token should be in response
        expect(response.body).toHaveProperty('resetToken')
        const resetToken = response.body.resetToken
        // Assert reset token can be verified to contain userId and otpID
        const extracted = jwt.verify(resetToken, process.env.RESET_TOKEN_SECRET!) as { userId: string, otpId: string}
        const {userId, otpId} = extracted
        expect(userId).toBe(userOneId.toString())
        expect(otpId).toBe(validOtpId.toString())
        // Assert otp has been updated with used = true
        const usedOtp = await Otp.findById(otpId)
        expect(usedOtp.used).toBe(true)
    })
})