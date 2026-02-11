import request from 'supertest';
import { server } from '../setup/testServer.js';
import { beforeEach, describe, expect, test } from 'vitest';
import { Theme } from '../../models/theme.model.js';
import { Dream } from '../../models/dream.model.js';
import { baseUrl, assertErrors } from './utils.js';
import { getAuthHeader, userThreeCreds, createUser, guestUserCreds } from './data.js';
import { User } from '../../models/user.model.js';
import { oldDreamData } from '../dreams/data.js';
import { Types } from 'mongoose';
import { wipeDB } from '../setup/wipeDB.js';

let userThreeAuth: [string, string]
let guestAuth: [string, string]
let userThreeId : Types.ObjectId
let dreamId : Types.ObjectId

// Wipe db and save data
beforeEach(async () => {
    await wipeDB()

    // Create a user to be owner of dreams
    const userThree = await createUser(userThreeCreds)
    userThreeId = userThree._id
    userThreeAuth = getAuthHeader(userThree.tokens[0])

    // Create dreams and themes with saved user to test casade deletion
    const oldDream = await new Dream({...oldDreamData, owner: userThree._id}).save()
    dreamId = oldDream._id
    await new Theme({theme: 'Adventure', dream: oldDream._id}).save()
    await new Theme({theme: 'Freedom', dream: oldDream._id}).save()

    // Create guest user to test that deletion is forbidden in guest account
    const guest = await createUser({...guestUserCreds, isGuest: true})
    guestAuth = getAuthHeader(guest.tokens[0])
}) 

const url = baseUrl + '/delete' 

// Tests

describe('FAILURE', () => {

    test('Account deletion should fail when not authenticated.', async () => {
        // Send unauthenticated response
        const response = await request(server).delete(url).expect(401)
        assertErrors(response.body.errors, [{param: 'token', msg: 'Please provide json web token to authenticate.'}])        
    }) 
    
    test('Account deletion should fail when signed in as guest.', async () => {
        // Send response authenticated as guest
        const response = await request(server).delete(url).set(...guestAuth).expect(403)
        expect(response.body.error).toBe('Guest users are not authorized to delete account.')
    })
})

describe('SUCCESS', () => {

    test('Account deletion should be successful when authenticated, and associated dreams and themes should be deleted.', async () => {
        // First prove that only 1 dream exists for userThree
        const dreams = await Dream.find({owner: userThreeId})
        expect(dreams).toHaveLength(1)
        const dream = dreams[0]
        expect([dream.title, dream.description]).toEqual([oldDreamData.title, oldDreamData.description])
        // Prove that only 2 themes exist for userThree's single dream
        const themes = await Theme.find({dream: dreamId})
        expect(themes).toHaveLength(2)
        themes.map(t => expect(['Adventure', 'Freedom'].includes(t.theme)))
        // Delete user 3
        await request(server).delete(url).set(...userThreeAuth).expect(200)
        // Assert deletion cascade works: dreams and themes should be gone
        const nullDreams = await Dream.find({owner: userThreeId})
        expect(nullDreams).toHaveLength(0)
        const nullThemes = await Theme.find({dream: dreamId})
        expect(nullThemes).toHaveLength(0)
    })
})

