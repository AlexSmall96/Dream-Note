import { server } from '../setup/testServer.js';
import { beforeEach, describe, expect, test } from 'vitest';
import { createUser, getAuthHeader } from './utils/userCreation.js';
import { baseUrl, userOneCreds, guestUserCreds, userThreeCreds } from './data.js';
import { wipeDB } from '../setup/wipeDB.js';
import { Types } from 'mongoose';
import { patchDataWithAuth, sendData } from './utils/sendData.js';
import { Otp } from '../../models/OTP.model.js';
import { User } from '../../models/user.model.js';
import { assertSingleError } from './utils/assertErrors.js';

let userOneAuth: [string, string]
let userThreeAuth: [string, string]
let guestAuth: [string, string]
let userOneId : Types.ObjectId
let otpId: string

// Wipe db and save data
beforeEach(async () => {
    await wipeDB()

    // Create a standard user to test update success and failure
    const userOne = await createUser(userOneCreds)
    userOneAuth = getAuthHeader(userOne.tokens[0])
    userOneId = userOne._id

    // Createa a user to ensure they cannot acccess userOnes otp
    const userThree = await createUser(userThreeCreds)
    userThreeAuth = getAuthHeader(userThree.tokens[0])
    // Create guest user to test that update is forbidden
    const guest = await createUser({...guestUserCreds, isGuest: true})
    guestAuth = getAuthHeader(guest.tokens[0])

    // Create 3 otps for userOne: valid, expired and used
    const otp = await new Otp({
        userId: userOneId,
        email: 'user1-new@email.com',
        otp: '123456',
        purpose: 'email-update',
        expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    }).save()

    otpId = otp._id.toString()

    await new Otp({
        userId: userOneId,
        email: 'user1-new2@email.com',
        otp: '445566',
        purpose: 'email-update',
        expiresAt: new Date(2025, 0, 1) // Expired
    }).save()

    await new Otp({
        userId: userOneId,
        email: 'user1-new3@email.com',
        otp: '778899',
        purpose: 'email-update',
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        used: true // Already used
    }).save()    
})

const url = baseUrl + '/update-email'

// Tests

describe('Updating email address should fail if:', async () => {
    test('User is not authenticated.', async () => {
        await sendData(server, url, {otp: '123456'}, 401)
    })
    test('User is authenticated as guest.', async () => {
        // Send response as guest
        const response = await patchDataWithAuth(server, url, {otp: '123456'}, 403, guestAuth)
        assertSingleError(response.body.errors, 'Guest users are not authorized to update profile details.')
    })
    test('OTP is missing from request body.', async () => {
        // Send response without OTP
        const response = await patchDataWithAuth(server, url, {}, 400, userOneAuth)
        assertSingleError(response.body.errors, 'Please provide the OTP that was sent to your email address.', 'otp')
    })
    test('Provided OTP is invalid.', async () => {
        // Send incorrect otp value
        const response = await patchDataWithAuth(server, url, {otp: '113355'}, 400, userOneAuth)
        assertSingleError(response.body.errors, 'Invalid or expired OTP.', 'otp')
    })
    test('Provided OTP does not belong to currently authenticated user.', async () => {
        // Send existing otp value belonging to userOne but authenticated as userThree
        const response = await patchDataWithAuth(server, url, {otp: '123456'}, 400, userThreeAuth)
        assertSingleError(response.body.errors, 'Invalid or expired OTP.', 'otp')
    })
    test('OTP is found in database but expired.', async () => {
        // Send request with expired otp value
        const response = await patchDataWithAuth(server, url, {otp: '445566'}, 400, userOneAuth)
        assertSingleError(response.body.errors, 'Invalid or expired OTP.', 'otp')
    })
    test('OTP is found in database but has been used.', async () => {
        const response = await patchDataWithAuth(server, url, {otp: '778899'}, 400, userOneAuth)
        assertSingleError(response.body.errors, 'Invalid or expired OTP.', 'otp')
    })
})

describe('Updating email address should succeed if:', () => {
    test('Otp value is associated with a valid otp in database associated with the correct user.', async () => {
        // Assert userOne has original email address before request is sent
        const user = await User.findByIdOrThrowError(userOneId.toString())
        expect(user.email).toBe(userOneCreds.email)
        // Send valid otp value
        const response = await patchDataWithAuth(server, url, {otp: '123456'}, 200, userOneAuth)
        expect(response.body.message).toBe('Email updated successfully.')
        // Users email should be updated to email value saved in otp record
        const updatedUser = await User.findByIdOrThrowError(userOneId.toString())
        expect(updatedUser.email).toBe('user1-new@email.com')
        // Otp should be deleted
        const nullOtp = await Otp.findById(otpId)
        expect(nullOtp).toBeNull()
    })
})

