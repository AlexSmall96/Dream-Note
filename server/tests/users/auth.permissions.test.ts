import request from 'supertest';
import { server } from '../setup/testServer.js';
import { beforeEach, describe, expect, test } from 'vitest';
import { User } from '../../models/user.model.js';
import { baseUrl, assertErrors } from './utils.js';
import { getAuthHeader, userType, userOneCreds, createUser } from './data.js';
import { wipeDB } from '../setup/wipeDB.js';

let userOne: userType
let userOneAuth: [string, string]

// Wipe db and save data
beforeEach(async () => {
    wipeDB()
    userOne = await createUser(userOneCreds)
    userOneAuth = getAuthHeader(userOne.tokens[0])
})

// Define url
const signupUrl = baseUrl + '/signup'

// Signup tests
describe('SIGNUP FAILURE', () => {

    test('Signup should fail with taken email address or password too short.', async () => {
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

    test('Signup should fail with invalid email address or password containing "password".', async () => {
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

describe('SIGNUP SUCCESS', () => {
    test('Signup should succeed with valid data.', async() => {
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
        user = await User.findOne({email: 'user2@email.com'})
        expect(user).not.toBeNull()
    })
})

// Define url
const loginUrl = baseUrl + '/login'

// Auth tests: Login, Logout and auth/me
describe('LOGIN FAILURE', () => {
    test('Login should fail with incorrect email address.', async () => {
        // Post unused email address
        const response = await request(server).post(loginUrl).send({
            email: 'notauser@email.com',
            password: 'apple123'            
        }).expect(400)
        // 1 error message should be present
        assertErrors(response.body.errors, [{param: 'email', msg: 'No account found associated with provided email address.'}])
    })

    test('Login should fail with incorrect password.', async () => {
        // Post correct email address with incorrect password
        const response = await request(server).post(loginUrl).send({
            email: 'user1@email.com',
            password: 'apple12'            
        }).expect(400)
        // Should be 1 error message in response
        assertErrors(response.body.errors, [{param: 'password', msg: 'Incorrect password.'}])
    })
})

describe('LOGOUT FAILURE', () => {
    test('Logout should fail when not authenticated.', async () => {
        // No token
        const responseNoToken = await request(server).post(`${baseUrl}/logout`).expect(401)
        assertErrors(responseNoToken.body.errors, [{param: 'token', msg: 'Please provide json web token to authenticate.'}])
        // Invalid token
        const responseInvalidToken = await request(server).post(`${baseUrl}/logout`).set('Authorization', `Bearer 123`).expect(401)
        assertErrors(responseInvalidToken.body.errors, [{param: 'token', msg: 'Invalid token.'}])
    })
})

describe('GET AUTHENTICATED USER', () => {
    test('Get currently authenticated user returns correct data.', async () => {
        const response = await request(server).get(`${baseUrl}/auth/me`).set(...userOneAuth).expect(200)
        expect(response.body._id).toBe(userOne._id.toString())
        expect(response.body.email).toBe(userOne.email)
    })
})
