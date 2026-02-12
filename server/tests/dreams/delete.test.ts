import request from 'supertest';
import { beforeEach, describe, expect, test } from 'vitest';
import { wipeDB } from '../setup/wipeDB.js'
import { server } from '../setup/testServer.js'
import { userOneCreds, userThreeCreds } from '../users/data.js';
import {createUser, getAuthHeader} from '../users/utils/userCreation.js'
import { Theme } from '../../models/theme.model.js';
import { Dream } from '../../models/dream.model.js';
import { baseUrl } from './utils.js';
import { oldDreamData } from './data.js';
import { Types } from 'mongoose';

let userOneAuth: [string, string]
let userThreeAuth: [string, string]
let oldDreamId: Types.ObjectId

// Wipe db and save data
beforeEach(async () => {
    await wipeDB()

    // Create two users to test authorized case vs unauthorized
    const userOne = await createUser(userOneCreds)
    userOneAuth = getAuthHeader(userOne.tokens[0])
    const userThree = await createUser(userThreeCreds)
    userThreeAuth = getAuthHeader(userThree.tokens[0])

    // Create a dream owned by one of the saved users
    const oldDream = await new Dream({...oldDreamData, owner: userThree._id}).save()
    oldDreamId = oldDream._id
})

// Delete dream
describe('DELETE DREAM', () => {

    // Define url
    const url = baseUrl + '/delete'

    test('User cannot delete dream they are not the owner of.', async () => {
        // Attempt unauthorized deletion
        const response = await request(server).delete(`${url}/${oldDreamId}`).set(...userOneAuth).expect(401)
        expect(response.body.error).toBe('You are not authorized to delete this dream.')        
    })

    test('Dream deletion is successful if user is owner of dream, and associated themes are also deleted.', async () => {
        // The 2 themes associated with dream: oldDreamId should be in db
        const themeNames = ['Lateness', 'Anxiety']
        await Promise.all(themeNames.map(async (theme: string) => {
            const savedTheme = await Theme.find({theme, dream: oldDreamId})
            expect(savedTheme).not.toBeNull()
        }))
        // Delete dream authorized as correct owner
        await request(server).delete(`${url}/${oldDreamId}`).set(...userThreeAuth).expect(200)
        // Dream should be removed from database
        const dream = await Dream.findById(oldDreamId)
        expect(dream).toBeNull()
        // Associated themes should be removed
        await Promise.all(themeNames.map(async (theme: string) => {
            const nullTheme = await Theme.findOne({theme})
            expect(nullTheme).toBeNull()
        }))
    })
})