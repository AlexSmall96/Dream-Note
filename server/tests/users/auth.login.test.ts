import request from 'supertest';
import { server } from '../setup/testServer.js';
import { beforeEach, describe, expect, test } from 'vitest';
import { User } from '../../models/user.model.js';
import { baseUrl } from './utils.js';
import { userType, userOneCreds, createUser } from './data.js';
import { wipeDB } from '../setup/wipeDB.js';

let userOne: userType
let guestUser : userType

const guestUserCreds = {email: 'demo-test@email.com', password: 'demotest123'}

// Wipe db and save data
beforeEach(async () => {
    await wipeDB()
    userOne = await createUser({...userOneCreds, withTokens: false})
    guestUser = await createUser({...guestUserCreds, isGuest: true, withTokens: false})
})

// Define url
const loginUrl = baseUrl + '/login'

describe('LOGIN/LOGOUT SUCCESS', () => {
    test('Login to non guest account should be successful with correct credentials, and logout should succeed using generated token.', async () => {
        // Extract user id
        const id = userOne._id.toString()
        // Assert that only no tokens currently exist in database
        let user = await User.findByIdOrThrowError(id)
        expect(user.tokens).toHaveLength(0)
        // Send correct data
        const response = await request(server).post(loginUrl).send(userOne).expect(200)
        // User object and token should be returned
        expect(response.body.user).toMatchObject({email:userOne.email, _id: id})
        const token = response.body.token
        expect(token).not.toBeNull()
        expect(response.body).not.toHaveProperty('password')
        // Assert not guest account
        expect(response.body.isGuest).toBe(false)
        // Assert token was added to User in database
        user = await User.findByIdOrThrowError(id)
        expect(user.tokens).toHaveLength(1)
        // Logout
        await request(server).post(`${baseUrl}/logout`).set('Authorization', `Bearer ${token}`).expect(200)
        // Assert database has changed - Token should have been removed
        user = await User.findByIdOrThrowError(id)
        expect(user.tokens).toHaveLength(0)        
    })

    test('Login to guest account should be successful and isGuest flag should be true.', async () => {
        const response = await request(server).post(baseUrl + '/login-guest').send({}).expect(200)
        expect(response.body.isGuest).toBe(true)
    })
})