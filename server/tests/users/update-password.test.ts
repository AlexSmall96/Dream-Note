import { server } from '../setup/testServer.js';
import { beforeEach, describe, expect, test } from 'vitest';
import { assertErrors } from './utils/assertErrors.js';
import { createUser, getAuthHeader } from './utils/userCreation.js';
import { baseUrl, userOneCreds, guestUserCreds } from './data.js';
import { wipeDB } from '../setup/wipeDB.js';
import { sendData } from './utils/sendData.js';

let userOneAuth: [string, string]
let guestAuth: [string, string]

// Wipe db and save data
beforeEach(async () => {
    await wipeDB()

    // Create a standard user to test update success and failure
    const userOne = await createUser(userOneCreds)
    userOneAuth = getAuthHeader(userOne.tokens[0])
    
    // Create guest user to test that update is forbidden
    const guest = await createUser({...guestUserCreds, isGuest: true})
    guestAuth = getAuthHeader(guest.tokens[0])
})

const url = baseUrl + '/update-password'

// Tests

describe('Password update should fail when:', async () => {

    test('Current password value is incorrect.', async () => {
        const response = await sendData(server, url, {currPassword: 'orange123', password: 'grape123'}, 400, userOneAuth)
        assertErrors(response.body.errors, [{param: 'currPassword', msg: 'Current password incorrect.'}])
    })

    test('Current password value is missing.', async () => {
        // Send data without current password
        const response = await sendData(server, url, {password: 'grape123'}, 400, userOneAuth)
        // Should be 1 error message in response
        assertErrors(response.body.errors, [{param: 'currPassword', msg: 'Please provide current password to update.'}])   
    })

    test('New password value is missing.', async () => {
        // Send data without current password
        const response = await sendData(server, url, {currPassword: 'grape123'}, 400, userOneAuth)   
        // Should be 1 error message in response
        assertErrors(response.body.errors, [{param: 'password', msg: 'Please provide new password to update.'}])          
    })

    test('Current password is correct but new password is invalid.', async () => {
        // Send data with new password too short
        const responseTooShort = await sendData(server, url, {currPassword: 'apple123', password: 'hello'}, 400, userOneAuth)   
        // Correct error message returned
        assertErrors(responseTooShort.body.errors, [{param: 'password', msg: 'Password must be at least 8 characters.'}])   

        // Send data with new password containing password
        const responsePwd = await sendData(server, url, {currPassword: 'apple123', password: 'password134'}, 400, userOneAuth)  
        // Correct error message returned
        assertErrors(responsePwd.body.errors, [{param: 'password', msg: 'Password cannot contain "password".'}])                
    })

    test('User is not authenticated.', async () => {
        // Send unauthenticated response
        const response = await sendData(server, url, {currPassword: 'apple123', password: 'strawberrry123'}, 401)  
        assertErrors(response.body.errors, [{param: 'token', msg: 'Please provide json web token to authenticate.'}])
    })

    test('User is authenticated as guest.', async () => {
        // Send response as guest
        const response = await sendData(server, url, {currPassword: 'apple123', password: 'strawberrry123'}, 403, guestAuth)  
        expect(response.body.error).toBe('Guest users are not authorized to update profile details.')
    })
})

describe('Password update should succeed when:', async () => {
    test('Correct data is sent and user is authenticated as non guest.', async () => {
        const response = await sendData(server, url, {currPassword: 'apple123', password: 'strawberrry123'}, 200, userOneAuth)  
        // New password should and tokens not be returned in response
        // Should be no errors in response
        const nullProperties = ['password', 'tokens', 'error', 'errors']
        nullProperties.map(prop => {
            expect(response.body).not.toHaveProperty(prop)
        })
        expect(response.body.message).toBe('Password updated successfully.')
    })
})