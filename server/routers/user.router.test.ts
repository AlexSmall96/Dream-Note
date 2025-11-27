import request from 'supertest';
import { server, wipeDBAndSaveData, userOne } from '../test-utils/setupTests.js'
import { beforeEach, describe, expect, test } from 'vitest';
import { User } from '../models/user.model.js';

// Wipe db and save data
beforeEach(async () => wipeDBAndSaveData())

// Define base url for user router
const baseUrl = '/api/users'

// Helper function to make assertions on email and password errors
const assert = (errors: {param: string, msg: string}[], emailError: string, passwordError:string) => {
    expect(errors).toHaveLength(2)
    expect([errors[0].param, errors[1].param]).toEqual(['email', 'password'])
    expect([errors[0].msg, errors[1].msg]).toEqual([emailError, passwordError])
}

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
        const errors = response.body.errors
        assert(errors, 'Email address already in use.', 'Password must be at least 8 characters.')
    })

    test('Signup should fail with invalid email address or password containing "password".', async () => {
        const response = await request(server).post(url).send({
            email: 'user1',
            password: 'password'
        }).expect(400) 
        // Email error message and password error message should be returned
        const errors = response.body.errors
        assert(errors, 'Please provide a valid email address.', 'Password cannot contain "password"')      
    })

    test('Signup should succeed with valid data.', async() => {
        // Post correct data
        const response = await request(server).post(url).send({
            email: 'user2@email.com',
            password: 'apple123'
        }).expect(201)
        // Response contains correct details - contains email and not password
        expect(response.body).toMatchObject({email: 'user2@email.com'})
        // Assert the database was changed
        const user = await User.findOne({email: 'user2@email.com'})
        expect(user).not.toBeNull()
    })
})

// Login tests
describe('LOGIN', () => {
    // Define url
    const url = baseUrl + '/login'

    test('Login should fail with incorrect email address.', async () => {
        // Post unused email address
        const response = await request(server).post(url).send({
            email: 'notauser@email.com',
            password: 'apple123'            
        }).expect(400)
        // Should be 1 error message in response
        expect(response.body.errors).toHaveLength(1)
        const error = response.body.errors[0]
        expect(error.param).toBe('email')
        expect(error.message).toBe('No account found associated with provided email address.')
    })

    test('Login should fail with incorrect password.', async () => {
        // Post correct email address with incorrect password
        const response = await request(server).post(url).send({
            email: 'user1@email.com',
            password: 'apple12'            
        }).expect(400)
        // Should be 1 error message in response
        expect(response.body.errors).toHaveLength(1)
        const error = response.body.errors[0]
        expect(error.param).toBe('password')
        expect(error.message).toBe('Incorrect password.')
    })

    test('Login should be successful with correct credentials.', async () => {
        // Send correct data
        const response = await request(server).post(url).send(userOne).expect(200)
        // User object and token should be returned
        expect(response.body.user).toMatchObject({email:userOne.email})
        expect(response.body.token).not.toBeNull()
    })

    
})