import request from 'supertest';
import { wipeDB } from '../../setup/wipeDB.js'
import { beforeEach, expect, test, vi } from 'vitest';
import { baseUrl } from '../data.js';
import { createUser, getAuthHeader } from '../utils/userCreation.js';
import { userOneCreds } from '../data.js';
import { assertSingleError } from '../utils/assertErrors.js';
import { getSentOtp, mailOptionsType } from '../utils/getSentOtp.js';
import { User } from '../../../models/user.model.js';

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