import request from 'supertest';
import { server } from '../setup/testServer.js'
import { beforeEach, describe, expect, test } from 'vitest';
import { Theme } from '../../models/theme.model.js';
import { userThreeCreds, userFourCreds  } from '../users/data.js'
import { createUser, getAuthHeader } from '../users/utils/userCreation.js';
import { oldDreamData } from '../dreams/data.js';
import { wipeDB } from '../setup/wipeDB.js'
import { Types } from 'mongoose';
import { Dream } from '../../models/dream.model.js';
import { assertSingleError } from '../users/utils/assertErrors.js';
 
type dreamType = {
    title: string,
    description: string,
    date: Date,
    owner: Types.ObjectId,
    _id: Types.ObjectId
}

let userThreeAuth: [string, string]
let userFourAuth: [string, string]
let oldDream: dreamType
let oldDreamTheme1Id : Types.ObjectId
let userThreeId: Types.ObjectId

// Wipe db and save data
beforeEach(async () => {
    await wipeDB()

    // Create two users to test get all dreams and pagination & sorting
    const userThree = await createUser(userThreeCreds)
    userThreeAuth = getAuthHeader(userThree.tokens[0])
    const userFour = await createUser(userFourCreds)
    userFourAuth = getAuthHeader(userFour.tokens[0])
    userThreeId = userThree._id

    // Create two dreams owned by userThree
    oldDream = await new Dream({...oldDreamData, owner: userThree._id}).save()
    const oldDreamId = oldDream._id
    
    // Create two themes to associate with each dream
    const oldDreamTheme1 = await new Theme({theme: 'Lateness', dream: oldDreamId, owner: userThree._id}).save()
    oldDreamTheme1Id = oldDreamTheme1._id
})

// Define base url for theme router
const baseUrl = '/api/themes'

describe('Removing a theme should:', () => {
    // Define url
    const url = baseUrl + '/delete'

    test('Be forbidden if user is not the owner of the associated dream.', async () => {
        // Attempt to delete a theme associated with oldDream authorized as userFour
        const response = await request(server).delete(`${url}/${oldDreamTheme1Id}`).set(...userFourAuth).expect(403)
        assertSingleError(response.body.errors, 'You are not authorized to delete this theme.')
    })

    test('Be successful if user is owner of associcated dream.', async () => {
        // Delete a theme associated with oldDream authorized as userThree
        await request(server).delete(`${url}/${oldDreamTheme1Id}`).set(...userThreeAuth).expect(200)
        // Assert theme was removed from database
        const nullTheme = await Theme.findById(oldDreamTheme1Id)
        expect(nullTheme).toBeNull()
    })
})