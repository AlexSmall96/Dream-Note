import { wipeDB } from '../../setup/wipeDB.js'
import { beforeEach, describe, expect, test } from 'vitest';
import { baseUrl, guestUserCreds, userThreeCreds } from '../data.js';
import { createUser, getAuthHeader } from '../utils/userCreation.js';
import { userOneCreds } from '../data.js';
import { server } from '../../setup/testServer.js'
import { patchDataWithAuth } from '../utils/sendData.js';
import { Otp } from '../../../models/OTP.model.js';
import { Types } from 'mongoose';
import { assertSingleError } from '../utils/assertErrors.js';
import { User } from '../../../models/user.model.js';

let userOneId: Types.ObjectId
let validOtpId: Types.ObjectId
let userOneAuth: [string, string]
let guestUserAuth: [string, string]
let userThreeAuth: [string, string]

beforeEach(async () => {
    await wipeDB()

    // Create a user to test valid otp
    const userOne = await createUser({...userOneCreds, isVerified: false})
    userOneId = userOne._id
    userOneAuth = getAuthHeader(userOne.tokens[0])

    // Create a guest user to test failure for guests
    const guestUser = await createUser({...guestUserCreds, isGuest: true})
    guestUserAuth = getAuthHeader(guestUser.tokens[0])
    
    // Create a user to test failure for already verified email
    const userThree = await createUser(userThreeCreds)
    userThreeAuth = getAuthHeader(userThree.tokens[0])

    // Valid otp
    const validOtp = await new Otp({
        userId: userOne._id,
        email: userOneCreds.email,
        otp: '123456',
        purpose: 'email-verification',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    }).save()
    validOtpId = validOtp._id

    // Incorrect purpose
    await new Otp({
        userId: userOne._id,
        email: userOneCreds.email,
        otp: '112233',
        purpose: 'email-update',
        expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    }).save()

    // Expired
    await new Otp({
        userId: userOne._id,
        email: userOneCreds.email,
        otp: '789789',
        purpose: 'email-verification',
        expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }).save()
})  

const url = baseUrl + '/verify-email'

describe('Verify otp should fail if:', () => {
    test('User is authenticated as guest.', async () => {
        const response = await patchDataWithAuth(server, url, {otp: '123456'}, 403, guestUserAuth)
        assertSingleError(response.body.errors, 'Guest users are not authorized to verify email.')
    })
    test('User is already verified.', async () => {
        const response = await patchDataWithAuth(server, url, {otp: '123456'}, 400, userThreeAuth)
        assertSingleError(response.body.errors, 'Email address is already verified.')
    })
    test('Otp value is missing from request body.', async () => {
        const response = await patchDataWithAuth(server, url, {}, 400, userOneAuth)
        assertSingleError(response.body.errors, 'Please provide the OTP that was sent to your email address.', 'otp')
    })
    test('Otp associated with authenticated user could not be found.', async () => {
        const response = await patchDataWithAuth(server, url, {otp: '445566'}, 400, userOneAuth)
        assertSingleError(response.body.errors, 'Invalid or expired OTP.', 'otp')
    })
    test('Otp associated with authenticated user is found but purpose is incorrect.', async () => {
        const response = await patchDataWithAuth(server, url, {otp: '112233'}, 400, userOneAuth)
        assertSingleError(response.body.errors, 'Invalid or expired OTP.', 'otp')
    })
    test('Otp with correct purpose is found but it is expired.', async () => {
        const response = await patchDataWithAuth(server, url, {otp: '789789'}, 400, userOneAuth)
        assertSingleError(response.body.errors, 'Invalid or expired OTP.', 'otp')
    })    
})

describe('Verifying otp and email should succeed if:', () => {
    test('Provided otp value is associated with a valid otp record.', async () => {
        // Assert otp is currently saved in db
        const otpRecord = await Otp.findById(validOtpId)
        expect(otpRecord).not.toBeNull()

        // Verify email using otp
        const response = await patchDataWithAuth(server, url, {otp: '123456'}, 200, userOneAuth)
        expect(response.body.message).toBe('Email verified successfully.')

        // Otp should now be deleted
        const nullOtp = await Otp.findById(validOtpId)
        expect(nullOtp).toBeNull()

        // User should be verified
        const user = await User.findByIdOrThrowError(userOneId.toString())
        expect(user.isVerified).toBe(true)
    })
})