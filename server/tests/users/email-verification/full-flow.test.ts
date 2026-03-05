import request from 'supertest';
import { wipeDB } from '../../setup/wipeDB.js'
import { beforeEach, expect, test, vi } from 'vitest';
import { baseUrl } from '../data.js';
import { createUser, getAuthHeader } from '../utils/userCreation.js';
import { userOneCreds } from '../data.js';
import { assertSingleError } from '../utils/assertErrors.js';
import { getSentOtp, mailOptionsType } from '../utils/getSentOtp.js';
import { User } from '../../../models/user.model.js';
import bcrypt from "bcrypt";

let userOneAuth: [string, string]
let userOneId: string

let sentMail: mailOptionsType[] = []
// Wipe db and save data
beforeEach(async () => {
    await wipeDB()

    // Create an unverified user
    const userOne = await createUser({...userOneCreds, isVerified: false})
    userOneAuth = getAuthHeader(userOne.tokens[0])
    userOneId = userOne._id.toString()
    vi.clearAllMocks() // Reset number of send mail calls
})

// Mock nodemailer with vi 
vi.mock("nodemailer", () => {
    const sendMail = vi.fn((mailOptions) => {
        sentMail.push(mailOptions);  // capture mail options
        return Promise.resolve(true);
    });

    return {
        default: {
        createTransport: vi.fn(() => ({ sendMail }))
        }
    };
})


// Import server after mock
import { server } from '../../setup/testServer.js'
import { patchDataWithAuth } from '../utils/sendData.js';
import { Otp } from '../../../models/OTP.model.js';

const url = baseUrl + '/request-email-verification'

test('Authenticated user can request email verification and verify email using real OTP.', async () => {
    // Request email verification
    await request(server).post(url).set(...userOneAuth).expect(200)
    // Extract mail options
    const otp = getSentOtp(sentMail)

    // Verify otp value
    const verifyUrl = baseUrl + '/verify-email'
    const response = await request(server).patch(verifyUrl).set(...userOneAuth).send({otp}).expect(200)
    expect(response.body.message).toBe("Email verified successfully.")

    // Assert the user is marked as verified in the db
    const user = await User.findByIdOrThrowError(userOneId)
    expect(user.isVerified).toBe(true)

    // Assert that user can no longer request email verification
    const errorResponse = await request(server).post(url).set(...userOneAuth).expect(400)
    assertSingleError(errorResponse.body.errors, 'Email address is already verified.', 'email')

    // Assert that user can now update password
    const newPassword = '1@3c5t!r'
    const updatePasswordUrl = baseUrl + '/update-password'
    const updateResponse = await patchDataWithAuth(server, updatePasswordUrl, {currPassword: userOneCreds.password, password: newPassword}, 200, userOneAuth)
    expect(updateResponse.body.message).toBe("Password updated successfully.")

    // Asser that user can delete account
    const deleteUrl = baseUrl + '/delete'
    await request(server).delete(deleteUrl).set(...userOneAuth).expect(200)
})

test('Requesting verification again before using an otp should delete old otp.', async () => {
    // Request email verification
    await request(server).post(url).set(...userOneAuth).expect(200)
    // Extract mail options
    const otpOne = getSentOtp(sentMail)  
    
    // Make request again
    await request(server).post(url).set(...userOneAuth).expect(200)
    const otpTwo = getSentOtp(sentMail)  

    // otpOne should be deleted
    const verifyUrl = baseUrl + '/verify-email'
    const errResponse = await request(server).patch(verifyUrl).set(...userOneAuth).send({otp: otpOne}).expect(400)
    assertSingleError(errResponse.body.errors, 'Invalid or expired OTP.', 'otp')

    const otpRecords = await Otp.find({userId: userOneId})
    expect(otpRecords).toHaveLength(1)
    const hashedOtp = otpRecords[0].otp
    const isMatch = await bcrypt.compare(otpTwo, hashedOtp) // Only otp left associated with userOne is otpTwo
    expect(isMatch).toBe(true)

    // otpTwo should be valid
    const response = await request(server).patch(verifyUrl).set(...userOneAuth).send({otp: otpTwo}).expect(200)
    expect(response.body.message).toBe("Email verified successfully.")
})