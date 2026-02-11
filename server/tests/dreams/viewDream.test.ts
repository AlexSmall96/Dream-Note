import request from 'supertest';
import { beforeEach, describe, expect, test } from 'vitest';
import { wipeDB } from '../setup/wipeDB.js'
import { server } from '../setup/testServer.js'
import { baseUrl } from './utils.js';
import { Types } from 'mongoose';
import { userOneCreds, userThreeCreds, createUser, getAuthHeader } from '../users/data.js';
import { Dream } from '../../models/dream.model.js';
import { oldDreamData } from './data.js';
import { Theme } from '../../models/theme.model.js';

let userOneAuth: [string, string]
let userThreeAuth: [string, string]
let oldDreamId: Types.ObjectId
let userThreeId: Types.ObjectId

// Wipe db and save data
beforeEach(async () => {
    await wipeDB()

    // Create two users to test authorized case vs unauthorized
    const userOne = await createUser(userOneCreds)
    userOneAuth = getAuthHeader(userOne.tokens[0])
    const userThree = await createUser(userThreeCreds)
    userThreeAuth = getAuthHeader(userThree.tokens[0])
    userThreeId = userThree._id

    // Create a dream owned by one of the saved users
    const oldDream = await new Dream({...oldDreamData, owner: userThree._id}).save()
    oldDreamId = oldDream._id

    // Create themes associated with old dream
    await new Theme({theme: 'Lateness', dream: oldDreamId}).save()
    await new Theme({theme: 'Anxiety', dream: oldDreamId}).save()
})

// Tests

describe('VIEW DREAM DETAILS', () => {
    const url = baseUrl + '/view'

    test('View dream should succeed with valid id if user is owner of dream.', async () => {
        // View one of userThree's dreams
        const response = await request(server).get(`${url}/${oldDreamId}`).set(...userThreeAuth).expect(200)
        const { dream, themes } = response.body
        const { title, description, date, owner } = dream
        // Assert that dream response matches test data
        expect(title).toBe(oldDreamData.title)
        expect(description).toBe(oldDreamData.description)
        expect(date).toBe(oldDreamData.date)
        expect(owner).toBe(userThreeId.toString())
        // Assert themes are correct - should be 2 in total
        expect(themes).toHaveLength(2)
        // Should be sorted alphabetically
        expect(themes[0].theme).toBe('Anxiety')
        expect(themes[1].theme).toBe('Lateness')
        // Both themes should have oldDreamId as dream
        expect(themes[0].dream).toBe(oldDreamId.toString())
        expect(themes[1].dream).toBe(oldDreamId.toString())
    })

    test('View dream should fail if user is not owner of dream.', async () => {
        // View one of userThree's dreams, authorized as userOne
        const response = await request(server).get(`${url}/${oldDreamId}`).set(...userOneAuth).expect(401)
        // Error message should be returned
        expect(response.body.error).toBe('You are not authorized to view this dream.')
    })
})