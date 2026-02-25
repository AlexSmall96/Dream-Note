import { wipeDB } from '../../setup/wipeDB.js'
import { beforeEach, expect, test, vi } from 'vitest';
import { baseUrl } from '../data.js';
import { createUser } from '../utils/userCreation.js';
import { userOneCreds } from '../data.js';
import { Types } from 'mongoose';
import { User } from '../../../models/user.model.js';
import bcrypt from "bcrypt";

let userOneId: Types.ObjectId

// Wipe db and save data
beforeEach(async () => {
    await wipeDB()
    // Create a user to test success for valid email address
    const userOne = await createUser(userOneCreds)
    userOneId = userOne._id
    vi.clearAllMocks() // Reset number of send mail calls
})

type mailOptions = {
    from: string,
    to: string,
    subject: string,
    text: string
}

let sentMail: mailOptions[] = []

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


const getSentOtp = () => {
    const n = sentMail.length
    const mailText = sentMail[n-1].text
    const index = mailText.search(/[0-9]+/)
    const otpLength = 6
    const otp = mailText.substring(index, index + otpLength)
    return otp
}


// Import server after mock
import { server } from '../../setup/testServer.js'
import { patchDataWithNoAuth, postDataWithNoAuth } from '../utils/sendData.js';

test('Unauthenticated user can request password reset and reset password using real OTP.', async () => {
    // Request password reset with email   
    let url = baseUrl + '/request-password-reset'
    await postDataWithNoAuth(server, url, {email: userOneCreds.email}, 200)
    // Extract mail options
    const otp = getSentOtp()

    // Verify otp value
    url = baseUrl + '/verify-reset-otp'
    const response = await postDataWithNoAuth(server, url, {email: userOneCreds.email, otp}, 200)
    const resetToken = response.body.resetToken

    // Reset password using reset token
    url = baseUrl + '/reset-password'
    const newPassword = '1@3c5t!r'
    const finalResponse = await patchDataWithNoAuth(server, url, {resetToken, password: newPassword }, 200)
    expect(finalResponse.body.message).toBe("Password updated successfully.")

    // Assert the password was changed in the db
    const user = await User.findByIdOrThrowError(userOneId.toString())
    const isMatch = await bcrypt.compare(newPassword, user.password)
    expect(isMatch).toBe(true)

    // Assert that user can login with new password
    url = baseUrl + '/login'
    const loginResponse = await postDataWithNoAuth(server, url, {email: userOneCreds.email, password: newPassword}, 200)
    const body = loginResponse.body
    expect(body.isGuest).toBe(false)
    expect(body.user).toMatchObject({email: userOneCreds.email, _id: userOneId.toString()})
    expect(body.token).not.toBeNull()
    expect(response.body).not.toHaveProperty('password')
})