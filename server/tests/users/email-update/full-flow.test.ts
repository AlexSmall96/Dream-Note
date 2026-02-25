import { wipeDB } from '../../setup/wipeDB.js'
import { beforeEach, expect, test, vi } from 'vitest';
import { baseUrl } from '../data.js';
import { createUser, getAuthHeader } from '../utils/userCreation.js';
import { userOneCreds } from '../data.js';
import { Types } from 'mongoose';
import { User } from '../../../models/user.model.js';
import { patchDataWithAuth, postDataWithAuth, postDataWithNoAuth } from '../utils/sendData.js';

let userOneId: Types.ObjectId
let userOneAuth: [string, string]

// Wipe db and save data
beforeEach(async () => {
    await wipeDB()
    // Create a user to test success for valid email address
    const userOne = await createUser(userOneCreds)
    userOneId = userOne._id
    userOneAuth = getAuthHeader(userOne.tokens[0])
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

test('Authenticated user can request email update and update email using real OTP.', async () => {
    // Request email update by sending otp to new email address  
    let url = baseUrl + '/request-email-update'
    const newEmail = 'new@email.com'
    await postDataWithAuth(server, url, {email: newEmail}, 200, userOneAuth)
    // Extract mail options
    const otp = getSentOtp()

    // Verify otp recieved in email
    url = baseUrl + '/update-email'
    const response = await patchDataWithAuth(server, url, {otp}, 200, userOneAuth)
    expect(response.body.message).toBe('Email updated successfully.')

    // Assert that email address was changed in db
    const user = await User.findByIdOrThrowError(userOneId.toString())
    expect(user.email).toBe(newEmail)

    // Asser that user can login with new email
    url = baseUrl + '/login'
    const loginResponse = await postDataWithNoAuth(server, url, {email: newEmail, password: userOneCreds.password}, 200)
    const body = loginResponse.body
    expect(body.isGuest).toBe(false)
    expect(body.user).toMatchObject({email: newEmail, _id: userOneId.toString()})
    expect(body.token).not.toBeNull()
    expect(response.body).not.toHaveProperty('password')
})