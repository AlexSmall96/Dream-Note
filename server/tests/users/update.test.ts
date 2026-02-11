import request from 'supertest';
import { server } from '../setup/testServer.js';
import { beforeEach, describe, expect, test } from 'vitest';
import { User } from '../../models/user.model.js';
import { baseUrl, assertErrors } from './utils.js';
import { createUser, getAuthHeader, userOneCreds, guestUserCreds } from './data.js';
import { wipeDB } from '../setup/wipeDB.js';
import { Types } from 'mongoose';

let userOneAuth: [string, string]
let guestAuth: [string, string]
let userOneId : Types.ObjectId

// Wipe db and save data
beforeEach(async () => {
    await wipeDB()

    // Create a standard user to test update success and failure
    const userOne = await createUser(userOneCreds)
    userOneAuth = getAuthHeader(userOne.tokens[0])
    userOneId = userOne._id
    
    // Create guest user to test that update is forbidden
    const guest = await createUser({...guestUserCreds, isGuest: true})
    guestAuth = getAuthHeader(guest.tokens[0])
})

const url = baseUrl + '/update'

// Tests

describe('UPDATE FAILURE', async () => {

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
        // Send unauthenticated response
        const response = await request(server).patch(url).send({
            currPassword: 'apple123',
            password: 'strawberrry123'
        }).expect(401)
        assertErrors(response.body.errors, [{param: 'token', msg: 'Please provide json web token to authenticate.'}])
    })

    test('Update should fail when signed in as guest.', async () => {
        // Send response as guest
        const response = await request(server).patch(url).send({
            email: 'demo-test2@email.com'
        }).set(...guestAuth).expect(403)
        expect(response.body.error).toBe('Guest users are not authorized to update profile details.')
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
        // Send data with taken address
        const response = await request(server).patch(url).send({
            email: 'user1',
        }).set(...userOneAuth).expect(400)
        // Correct error message is returned  
        assertErrors(response.body.errors, [{param: 'email', msg: 'Please provide a valid email address.'}])        
    })
})

describe('UPDATE SUCCESS', async () => {
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