
import { wipeDB } from '../../setup/wipeDB.js'
import { beforeEach, describe, expect, test } from 'vitest';
import { baseUrl } from '../data.js';
import { createUser } from '../utils/userCreation.js';
import { userOneCreds } from '../data.js';
import { server } from '../../setup/testServer.js'
import { patchDataWithNoAuth } from '../utils/sendData.js';
import { Otp } from '../../../models/OTP.model.js';
import jwt from "jsonwebtoken"
import { Types } from 'mongoose';
import { assertErrors, assertSingleError } from '../utils/assertErrors.js';

let validOtpId: Types.ObjectId
const invalidId = new Types.ObjectId()
let resetTokenNoUser: string
let resetTokenNoOtp: string
let validResetToken: string

const resetSecret = process.env.RESET_TOKEN_SECRET!
beforeEach(async () => {
    await wipeDB()

    // Create a user to test valid otp
    const userOne = await createUser(userOneCreds)
    
    // Save 2 otps
    // set purpose to password-reset as valid otp
    const otpRecord = await new Otp({
        userId: userOne._id,
        email: userOneCreds.email,
        otp: '123456',
        purpose: 'password-reset',
        used: true, // Set used to true to assert reset token is associated with a valid, used otp.
        expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    }).save()
    validOtpId = otpRecord._id

    // Set purpose to email-update for invalid otp
    await new Otp({
        userId: userOne._id,
        email: userOneCreds.email,
        otp: '112233',
        purpose: 'email-update',
        expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    }).save()
    
    validOtpId = otpRecord._id
    resetTokenNoUser = jwt.sign(
        { userId: invalidId, otpId: validOtpId },
        resetSecret,
        { expiresIn: "10m" }
    )

    resetTokenNoOtp = jwt.sign(
        { userId: userOne._id, otpId: invalidId },
        resetSecret,
        { expiresIn: "10m" }
    )

    validResetToken = jwt.sign(
        { userId: userOne._id, otpId: validOtpId },
        resetSecret,
        { expiresIn: "10m" }       
    )
})  

const url = baseUrl + '/reset-password'

// Tests

describe('Resetting password should fail if:', () => {
    test('Reset token is not provided in request body.', async () => {
        const response = await patchDataWithNoAuth(server, url, {password: 'apple123'}, 400)
        assertSingleError(response.body.errors, 'Reset token must be provided.', 'resetToken')
    })
    test('Password value is not provided in request body.', async () => {
        const response = await patchDataWithNoAuth(server, url, {resetToken: '123'}, 400)
        assertSingleError(response.body.errors, 'New password must be provided.', 'password')
    })
    test('Password does not meet complexity requirements.', async () => {
        const response = await patchDataWithNoAuth(server, url, {password: 'password', resetToken: '123'}, 400)
        assertErrors(response.body.errors, [{
            param: 'password', msg: 'Password cannot contain "password".', value: 'password'
        }])
        // Since the password validation comes from signupOrUpdate.validator.ts, testing the remaining complexity requirements is not necessay.
        // See auth.permissions.test.ts for tests covering all password complexity requirements
    })
    test('Reset token is invalid - not associated with any user.', async () => {
        const response = await patchDataWithNoAuth(server, url, {resetToken: resetTokenNoUser, password: 'apple123'}, 400)
        assertSingleError(response.body.errors, 'Invalid reset session.', 'resetToken')
    })
    test('Reset token is invalid - not associated with any otp record.', async () => {
        const response = await patchDataWithNoAuth(server, url, {resetToken: resetTokenNoOtp, password: 'apple123'}, 400)
        assertSingleError(response.body.errors, 'Invalid reset session.', 'resetToken')
    })
    test('Reset token is associated with an expired otp record.', async () => {
        await Otp.findByIdAndUpdate(validOtpId, {
            expiresAt: new Date(Date.now() - 1000)
        })
        const response = await patchDataWithNoAuth(server, url, {resetToken: validResetToken, password: 'apple123'}, 400)
        assertSingleError(response.body.errors, 'Invalid reset session.', 'resetToken')
    })
    test('Reset token is associate with an unused otp record.', async () => {
        await Otp.findByIdAndUpdate(validOtpId, {used: false})
        const response = await patchDataWithNoAuth(server, url, { resetToken: validResetToken, password: 'apple123' }, 400);
        assertSingleError(response.body.errors, 'Invalid reset session.', 'resetToken');        
    })
})

describe('Reseting password should succeed if:', () => {
    test('A valid reset token and password value are provided in request body.', async () => {
        // Assert otp exists in db
        const otp = await Otp.findById(validOtpId)
        expect(otp).not.toBeNull()
        const response = await patchDataWithNoAuth(server, url, {resetToken: validResetToken, password: 'apple123'}, 200)
        expect(response.body.message).toBe("Password updated successfully.")
        // Otp should be deleted
        const nullOtp = await Otp.findById(validOtpId)
        expect(nullOtp).toBeNull()
    })
})