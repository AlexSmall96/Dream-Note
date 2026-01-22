import request from 'supertest';
import { wipeDBAndSaveData, } from '../utils/test-utils/setupData.js'
import { userOne, userOneId, userOneAuth, userThreeAuth, userThreeId } from '../utils/test-utils/data/users.js'
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { User } from '../models/user.model.js';
import { Dream } from '../models/dream.model.js';
import { Theme } from '../models/theme.model.js';
import nodemailer from 'nodemailer';

// Wipe db and save data
beforeEach(async () => wipeDBAndSaveData())

// Define base url for user router
const baseUrl = '/api/users'

// Helper function to make assertions on email, password and token errors
const assertErrors = (
    errorsResponse: {param: string, msg: string}[], 
    errorMsgs : {param: string, msg: string}[]
) => {
    expect(errorsResponse).toHaveLength(errorMsgs.length)
    errorsResponse.forEach((error, index) => {
        expect(error).toMatchObject(errorMsgs[index])
    })
}

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

// Import server after mock
import { server } from '../utils/test-utils/testServer.js'

// Tests

// Signup tests
describe('SIGNUP', () => {
    // Define url
    const url = baseUrl + '/signup'

    test('Signup should fail with taken email address or password too short.', async () => {
        // Post should fail
        const response = await request(server).post(url).send({
            email: 'user1@email.com',
            password: 'apple'
        }).expect(400)
        // Email error message and password error message should be returned
        assertErrors(response.body.errors, [{
            param: 'email', msg: 'Email address already in use.'
        }, {
            param: 'password', msg: 'Password must be at least 8 characters.'
        }])

    })

    test('Signup should fail with invalid email address or password containing "password".', async () => {
        const response = await request(server).post(url).send({
            email: 'user1',
            password: 'password'
        }).expect(400) 
        // Email error message and password error message should be returned
        assertErrors(response.body.errors, [{
            param: 'email', msg: 'Please provide a valid email address.'
        }, {
            param: 'password', msg: 'Password cannot contain "password".'
        }])    
    })

    test('Signup should succeed with valid data.', async() => {
        // Assert db contains no user with email user2@email.com
        let user = await User.findOne({email: 'user2@email.com'})
        expect(user).toBeNull()
        // Post correct data
        const response = await request(server).post(url).send({
            email: 'user2@email.com',
            password: 'apple123'
        }).expect(201)
        // Response contains correct details - contains email and not password
        expect(response.body).not.toHaveProperty('password')
        // Assert the database was changed
        user = await User.findOne({email: 'user2@email.com'})
        expect(user).not.toBeNull()
    })
})

// Auth tests: Login, Logout and auth/me
describe('AUTH', () => {
    // Define url
    const url = baseUrl + '/login'

    test('Login should fail with incorrect email address.', async () => {
        // Post unused email address
        const response = await request(server).post(url).send({
            email: 'notauser@email.com',
            password: 'apple123'            
        }).expect(400)
        // 1 error message should be present
        assertErrors(response.body.errors, [{param: 'email', msg: 'No account found associated with provided email address.'}])
    })

    test('Login should fail with incorrect password.', async () => {
        // Post correct email address with incorrect password
        const response = await request(server).post(url).send({
            email: 'user1@email.com',
            password: 'apple12'            
        }).expect(400)
        // Should be 1 error message in response
        assertErrors(response.body.errors, [{param: 'password', msg: 'Incorrect password.'}])
    })

    test('Login should be successful with correct credentials, and logout should succeed using generated token.', async () => {
        // Extract user id
        const id = userOne._id.toString()
        // Assert that only 1 token currently exists in database
        let user = await User.findByIdOrThrowError(id)
        expect(user.tokens).toHaveLength(1)
        // Send correct data
        const response = await request(server).post(url).send(userOne).expect(200)
        // User object and token should be returned
        expect(response.body.user).toMatchObject({email:userOne.email, _id: id})
        const token = response.body.token
        expect(token).not.toBeNull()
        expect(response.body).not.toHaveProperty('password')
        // Assert token was added to User in database
        user = await User.findByIdOrThrowError(id)
        expect(user.tokens).toHaveLength(2)
        // Logout
        await request(server).post(`${baseUrl}/logout`).set('Authorization', `Bearer ${token}`).expect(200)
        // Assert database has changed - Token should have been removed
        user = await User.findByIdOrThrowError(id)
        expect(user.tokens).toHaveLength(1)        
    })

    test('Logout should fail when not authenticated.', async () => {
        // No token
        const responseNoToken = await request(server).post(`${baseUrl}/logout`).expect(401)
        assertErrors(responseNoToken.body.errors, [{param: 'token', msg: 'Please provide json web token to authenticate.'}])
        // Invalid token
        const responseInvalidToken = await request(server).post(`${baseUrl}/logout`).set('Authorization', `Bearer 123`).expect(401)
        assertErrors(responseInvalidToken.body.errors, [{param: 'token', msg: 'Invalid token.'}])
    })

    test('Get currently authenticated user returns correct data.', async () => {
        const response = await request(server).get(`${baseUrl}/auth/me`).set(...userOneAuth).expect(200)
        expect(response.body._id).toBe(userOneId.toString())
        expect(response.body.email).toBe(userOne.email)
    })
})

// Update account
describe('UPDATE', async () => {
    // Define url
    const url = baseUrl + '/update'

    test('Update should fail when current password value is incorrect and new password value is supplied.', async () => {
        // Send data with current password incorrect
        const response = await request(server).patch(url).send({
            currPassword: 'orange123', password: 'grape123'
        }).set(...userOneAuth).expect(400)
        // Should be 1 error message in response
        assertErrors(response.body.errors, [{param: 'currPassword', msg: 'Current password incorrect.'}])
    })

    test('Update should fail when current password value is missing and new password value is supplied.', async () => {
        // Send data without current password
        const response = await request(server).patch(url).send({password: 'grape123'}).set(...userOneAuth).expect(400)   
        // Should be 1 error message in response
        assertErrors(response.body.errors, [{param: 'currPassword', msg: 'Please provide current password to update.'}])   
    })

    test('Update should fail if current password is correct but new password is invalid.', async () => {
        // Send data with new password too short
        const responseTooShort = await request(server).patch(url).send({
            currPassword: 'apple123',
            password: 'hello'
        }).set(...userOneAuth).expect(400) 
        // Correct error message returned
        assertErrors(responseTooShort.body.errors, [{param: 'password', msg: 'Password must be at least 8 characters.'}])   

        // Send data with new password containing password
        const responsePwd = await request(server).patch(url).send({
            currPassword: 'apple123',
            password: 'password134'
        }).set(...userOneAuth).expect(400) 
        // Correct error message returned
        assertErrors(responsePwd.body.errors, [{param: 'password', msg: 'Password cannot contain "password".'}])                
    })

    test('Update should fail when not authenticated.', async () => {
        const response = await request(server).patch(url).send({
            currPassword: 'apple123',
            password: 'strawberrry123'
        }).expect(401)
        assertErrors(response.body.errors, [{param: 'token', msg: 'Please provide json web token to authenticate.'}])
    })
    test('Password update should succeed with valid data.', async () => {
        // Send valid data
        const response = await request(server).patch(url).send({
            currPassword: 'apple123',
            password: 'strawberrry123'
        }).set(...userOneAuth).expect(200)
        // New password should and tokens not be returned in response
        expect(response.body.user).not.toHaveProperty('password')
        expect(response.body.user).not.toHaveProperty('tokens')
    })

    test('Email update should fail with taken email address.', async () => {
        // Send data with taken email address
        const response = await request(server).patch(url).send({
            email: 'user1@email.com',
        }).set(...userOneAuth).expect(400)
        // Correct error message is returned  
        assertErrors(response.body.errors, [{param: 'email', msg: 'Email address already in use.'}])
    })

    test('Email update should fail with invalid email address.', async () => {
        // Send data with taken invalid address
        const response = await request(server).patch(url).send({
            email: 'user1',
        }).set(...userOneAuth).expect(400)
        // Correct error message is returned  
        assertErrors(response.body.errors, [{param: 'email', msg: 'Please provide a valid email address.'}])        
    })

    test('Email update should be successful wtih valid and available data.', async () => {
        // Send data with valid and available email address
        const response = await request(server).patch(url).send({
            email: 'user5@email.com',
        }).set(...userOneAuth).expect(200)
        // New email should be returned in response
        expect(response.body.user.email).toBe('user5@email.com')
        // Response should not contain password and tokens
        expect(response.body.user).not.toHaveProperty('password')
        expect(response.body.user).not.toHaveProperty('tokens')
        // Assert that the database was changed
        const user = await User.findByIdOrThrowError(userOneId.toString())
        expect(user).not.toBeNull()
        expect(user.email).toBe('user5@email.com')
    })
})

// Send OTP for password reset or email verification
// The below tests mock nodemailer and do not send an email
// The purpose of this test block is to assert request data is appropriately validated and error/success messages are returned
describe('SEND OTP', () => {
    const url = baseUrl + '/sendOTP'
    test('Send OTP fails if email address, OTP or expiresIn are missing.', async () => {
        // Expected error message
        const expErrorMsg = "Please provide a OTP, email address and expiresIn value."
        // Define 3 request bodies, each with a missing parameter
        const reqBodies = [
            {email: 'user4@email.com', expiresIn: 10},
            {OTP: 123456, expiresIn: 10},
            {email: 'user4@email.com', OTP: 123456}
        ]
        // Send each request, error message should be returned for each one
        await Promise.all(reqBodies.map(async (body) => {
            const response = await request(server).post(url).send(body).expect(400)
            expect(response.body.error).toBe(expErrorMsg)
        }))
    })

    test('Send OTP for password reset fails if email address is not associated with an account.', async () => {
        // Send data with unused email address
        const response = await request(server).post(url).send({
            email: 'user5@email.com',
            OTP: 123456,
            resetPassword: true,
            expiresIn: 10,
        }).expect(400)
        // Correct error message is recieved
        expect(response.body.error).toBe('No account was found associated with the given email address.')
    })

    test('Send OTP for update email address fails if email address is taken.', async () => {
        // Send data with taken email address
        const response = await request(server).post(url).send({
            email: 'user4@email.com',
            OTP: 123456,
            resetPassword: false,
            expiresIn: 10,
        }).expect(400)
        // Correct error message is recieved
        expect(response.body.error).toBe('Email address taken. Please choose a different email address.')
    })

    test("Send OTP is successful if correct data is sent.", async () => {
        // Extract mocked sendMail property
        const sendMailMock = nodemailer.createTransport().sendMail;
        // Send data to reset password
        const response = await request(server).post(url).send({
            email: 'user1@email.com',
            OTP: 123456,
            resetPassword: true,
            expiresIn: 10,
        }).expect(200)
        // Correct message should be returned
        expect(response.body.message).toBe( "OTP sent successfully.")
        // Assertions about sendMailMock calls and data 
        expect(sendMailMock).toHaveBeenCalledTimes(1);
        expect(sendMailMock).toHaveBeenCalledWith({
            from: process.env.SMTP_MAIL,
            to: 'user1@email.com',
            subject: `Your Dream Note OTP for password reset.`,
            text: `Your one time passcode (OTP) is 123456. This will expire in 10 minutes.`            
        })
    })
})

// Delete account
describe('DELETE', () => {
    // Define url
    const url = baseUrl + '/delete' 

    test('Account deletion should fail when not authenticated.', async () => {
        // Send unauthenticated response
        const response = await request(server).delete(url).expect(401)
        // Assert correct error is returned
        assertErrors(response.body.errors, [{param: 'token', msg: 'Please provide json web token to authenticate.'}])        
    })  

    test('Account deletion should be successful when authenticated.', async () => {
        // The 4 themes associated with userThree's dreams should be in db
        const themeNames = ['Lateness', 'Anxiety', 'Fear', 'Animals']
        await Promise.all(themeNames.map(async (theme: string) => {
            const savedTheme = await Theme.findOne({theme})
            expect(savedTheme).not.toBeNull()
        }))
        // Send authenticated response
        await request(server).delete(url).set(...userThreeAuth).expect(200)
        // Users dreams should be deleted, along with any themes associated with them
        const dreams = await Dream.find({owner: userThreeId})
        expect(dreams).toHaveLength(0)
        // Assert themes are no longer in the database
        await Promise.all(themeNames.map(async (theme: string) => {
            const nullTheme = await Theme.findOne({theme})
            expect(nullTheme).toBeNull()
        }))
    })
})