import request from 'supertest';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { User } from '../../../models/user.model.js';
import { assertErrors, assertSingleError } from '../utils/assertErrors.js'
import { createUser, userType, getAuthHeader } from '../utils/userCreation.js';
import { baseUrl, userOneCreds } from '../data.js';
import { wipeDB } from '../../setup/wipeDB.js';
import * as otpUtils from "../../../services/utils/otp.js";
import nodemailer from 'nodemailer';
import bcrypt from "bcrypt";

let userOne: userType
let userOneAuth: [string, string]

// Wipe db and save data
beforeEach(async () => {
    await wipeDB()
    userOne = await createUser(userOneCreds)
    userOneAuth = getAuthHeader(userOne.tokens[0])
    vi.clearAllMocks() // Reset number of send mail calls
})

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

// Mock generated OTP to assert correct email body
vi.spyOn(otpUtils, "generateOtp").mockReturnValue('123456');

import { server } from '../../setup/testServer.js';
import { Otp } from '../../../models/OTP.model.js';

// Define url
const signupUrl = baseUrl + '/signup'

// Signup tests
describe('Signup should fail if:', () => {

    test('Email address is taken or password is too short.', async () => {
        // Post should fail
        const response = await request(server).post(signupUrl).send({
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

    test('Email address is invalid or password contains "password".', async () => {
        const response = await request(server).post(signupUrl).send({
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
})

describe('If valid data is provided: ', () => {
    test('Signup should be successful.', async() => {
        // Assert db contains no user with email user2@email.com
        let user = await User.findOne({email: 'user2@email.com'})
        expect(user).toBeNull()
        // Post correct data
        const response = await request(server).post(signupUrl).send({
            email: 'user2@email.com',
            password: 'apple123'
        }).expect(201)
        // Response contains correct details - contains email and not password
        expect(response.body).not.toHaveProperty('password')
        // Assert the database was changed
        const savedUser = await User.findByEmailOrThrowError('user2@email.com')
        expect(savedUser).not.toBeNull()
        expect(savedUser.isVerified).toBe(false)
    })
    test('Verification email should be sent to supplied email address.', async () => {
        // Assert to otp is not saved in db yet
        const nullOtp = await Otp.find()
        expect(nullOtp).toHaveLength(0) 
        const sendMailMock = nodemailer.createTransport().sendMail;
        
        // Post correct data
        const newEmail = 'user2@email.com'
        const response = await request(server).post(signupUrl).send({
            email: newEmail ,
            password: 'apple123'
        }).expect(201)      

        // Assert email has correct data
        expect(response.body.message).toBe('Signup succesful. Please check your emails for verification instructions.')
        expect(sendMailMock).toHaveBeenCalledTimes(1)

        const thankYouText = 'Thank you for signing up to Dream Note.\n'
        const otpText = 'Your one time passcode (OTP) is 123456. This will expire in 24 hours.\n'
        const instructionsText = 'Please visit the account page and enter this passcode to verify your email address.'
        const text = thankYouText + otpText + instructionsText
        const subject = 'Your Dream Note OTP for email-verification.'

        expect(sendMailMock).toHaveBeenCalledWith({
            from: process.env.SMTP_MAIL,
            to: newEmail,
            subject,
            text          
        }) 

        const user = await User.findByEmailOrThrowError(newEmail)
        // Otp should now be saved in db
        const otpRecords = await Otp.find({
            userId: user._id,
            email: newEmail,
            purpose: 'email-verification',
            used: false
        })
        expect(otpRecords).toHaveLength(1)
        const hashedOtp = otpRecords[0].otp
        const isMatch = await bcrypt.compare('123456', hashedOtp)
        expect(isMatch).toBe(true)
    })
})

// Define url
const loginUrl = baseUrl + '/login'

// Auth tests: Login, Logout and auth/me
describe('Login should fail if:', () => {
    test('Email address is incorrect.', async () => {
        // Post unused email address
        const response = await request(server).post(loginUrl).send({
            email: 'notauser@email.com',
            password: 'apple123'            
        }).expect(400)
        // 1 error message should be present
        assertSingleError(response.body.errors, 'No account found associated with provided email address.', 'email')
    })

    test('Password is incorrect.', async () => {
        // Post correct email address with incorrect password
        const response = await request(server).post(loginUrl).send({
            email: 'user1@email.com',
            password: 'apple12'            
        }).expect(400)
        // Should be 1 error message in response
        assertSingleError(response.body.errors, 'Incorrect password.', 'password')
    })
})

describe('Logout should fail if:', () => {
    test('User is not authenticated.', async () => {
        // No token
        const responseNoToken = await request(server).post(`${baseUrl}/logout`).expect(401)
        assertErrors(responseNoToken.body.errors, [{param: 'token', msg: 'Please provide json web token to authenticate.'}])
        // Invalid token
        const responseInvalidToken = await request(server).post(`${baseUrl}/logout`).set('Authorization', `Bearer 123`).expect(401)
        assertSingleError(responseInvalidToken.body.errors, 'Invalid token.', 'token')
    })
})

describe('Get currently authenticated user should:', () => {
    test('Return correct data.', async () => {
        const response = await request(server).get(`${baseUrl}/auth/me`).set(...userOneAuth).expect(200)
        expect(response.body.user._id).toBe(userOne._id.toString())
        expect(response.body.user.email).toBe(userOne.email)
        expect(response.body.isGuest).toBe(false)
    })
})
