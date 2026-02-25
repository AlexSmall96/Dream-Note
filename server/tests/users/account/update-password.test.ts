import { server } from '../../setup/testServer.js';
import { beforeEach, describe, expect, test } from 'vitest';
import { assertErrors, assertSingleError } from '../utils/assertErrors.js';
import { createUser, getAuthHeader } from '../utils/userCreation.js';
import { baseUrl, userOneCreds, guestUserCreds, userThreeCreds } from '../data.js';
import { wipeDB } from '../../setup/wipeDB.js';
import { patchDataWithAuth } from '../utils/sendData.js';

let userOneAuth: [string, string]
let userThreeAuth: [string, string]
let guestAuth: [string, string]

// Wipe db and save data
beforeEach(async () => {
    await wipeDB()

    // Create a verified user to test update success and failure
    const userOne = await createUser(userOneCreds)
    userOneAuth = getAuthHeader(userOne.tokens[0])
    
    // Create an unverified user to test update is forbidden
    const userThree = await createUser({...userThreeCreds, isVerified: false})
    userThreeAuth = getAuthHeader(userThree.tokens[0])   

    // Create guest user to test that update is forbidden
    const guest = await createUser({...guestUserCreds, isGuest: true})
    guestAuth = getAuthHeader(guest.tokens[0])
})

const url = baseUrl + '/update-password'

// Tests

describe('Password update should fail when:', async () => {

    test('User is authenticated as guest.', async () => {
        // Send response as guest
        const response = await patchDataWithAuth(server, url, {currPassword: 'apple123', password: 'strawberrry123'}, 403, guestAuth)  
        assertSingleError(response.body.errors, 'Guest users are not authorized to update profile details.')
    })

    test("User's email address is not verified.", async () => {
        const response = await patchDataWithAuth(server, url, {currPassword: 'apple123', password: 'strawberrry123'}, 403, userThreeAuth) 
        assertSingleError(response.body.errors, 'Please verify your email address to update your password.')
    })

    test('Current password value is incorrect.', async () => {
        const response = await patchDataWithAuth(server, url, {currPassword: 'orange123', password: 'grape123'}, 400, userOneAuth)
        assertSingleError(response.body.errors, 'Current password is incorrect.', 'currPassword')
    })

    test('Current password value is missing.', async () => {
        // Send data without current password
        const response = await patchDataWithAuth(server, url, {password: 'grape123'}, 400, userOneAuth)
        // Should be 1 error message in response
        assertSingleError(response.body.errors, 'Please provide current password to update.', 'currPassword')
    })

    test('New password value is missing.', async () => {
        // Send data without current password
        const response = await patchDataWithAuth(server, url, {currPassword: 'grape123'}, 400, userOneAuth)   
        // Should be 1 error message in response
        assertSingleError(response.body.errors, 'Please provide new password to update.', 'password')
    })

    test('Current password is correct but new password is invalid.', async () => {
        // Send data with new password too short
        const responseTooShort = await patchDataWithAuth(server, url, {currPassword: 'apple123', password: 'hello'}, 400, userOneAuth)   
        // Correct error message returned
        assertSingleError(responseTooShort.body.errors, 'Password must be at least 8 characters.', 'password')

        // Send data with new password containing password
        const responsePwd = await patchDataWithAuth(server, url, {currPassword: 'apple123', password: 'password134'}, 400, userOneAuth)  
        // Correct error message returned
        assertSingleError(responsePwd.body.errors, 'Password cannot contain "password".', 'password')                
    })

})

describe('Password update should succeed when:', async () => {
    test('Correct data is sent and user is authenticated as non guest.', async () => {
        const response = await patchDataWithAuth(server, url, {currPassword: 'apple123', password: 'strawberrry123'}, 200, userOneAuth)  
        // New password should and tokens not be returned in response
        // Should be no errors in response
        const nullProperties = ['password', 'tokens', 'error', 'errors']
        nullProperties.map(prop => {
            expect(response.body).not.toHaveProperty(prop)
        })
        expect(response.body.message).toBe('Password updated successfully.')
    })
})