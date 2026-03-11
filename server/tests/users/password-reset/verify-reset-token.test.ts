import { wipeDB } from '../../setup/wipeDB.js'
import { beforeEach, describe, expect, test } from 'vitest';
import { authUrl } from '../data.js';
import { createUser } from '../utils/userCreation.js';
import { userOneCreds } from '../data.js';
import { server } from '../../setup/testServer.js'
import { postDataWithNoAuth } from '../utils/sendData.js';
import { Otp } from '../../../models/OTP.model.js';
import jwt from "jsonwebtoken"
import { assertSingleError } from '../utils/assertErrors.js';

const resetSecret = process.env.RESET_TOKEN_SECRET!

beforeEach(async () => {
    await wipeDB()
})

const url = authUrl + '/verify-token'

describe('Verifying password reset token should fail if:', () => {

    test('Reset token is not provided.', async () => {
        const response = await postDataWithNoAuth(server, url, {}, 400)
        assertSingleError(response.body.errors, 'Reset token must be provided.', 'resetToken')
    })

    test('Reset token is invalid.', async () => {
        const response = await postDataWithNoAuth(server, url, { resetToken: 'invalidtoken' }, 400)
        assertSingleError(response.body.errors, 'Invalid or expired session.')
    })
})

describe('Verifying password reset token should succeed if:', () => {
    test('A valid reset token is provided.', async () => {
        // Create a user to test valid otp
        const userOne = await createUser(userOneCreds)
        // Save otp with purpose password-reset
        const otpRecord = await new Otp({
            userId: userOne._id,
            email: userOneCreds.email,
            otp: '123456',
            purpose: 'password-reset',
            used: true, // Set used to true to assert reset token is associated with a valid, used otp.
            expiresAt: new Date(Date.now() + 10 * 60 * 1000)
        }).save()
        const resetToken = jwt.sign(
            { userId: userOne._id, otpId: otpRecord._id },
            resetSecret,    
        )
        const response = await postDataWithNoAuth(server, url, { resetToken }, 200)
        expect(response.body.message).toBe("Reset token is valid.")
    })
})