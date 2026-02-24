import request from 'supertest';
import { beforeEach, expect, test } from 'vitest';
import { wipeDB } from '../setup/wipeDB.js'
import { server } from '../setup/testServer.js'
import { userOneCreds, userThreeCreds } from '../users/data.js';
import {createUser, getAuthHeader} from '../users/utils/userCreation.js'
import { baseUrl } from './utils.js';
import { assertSingleError } from '../users/utils/assertErrors.js';
import { Types } from 'mongoose';
import { Dream } from '../../models/dream.model.js';
import { newDreamData } from './data.js';
import { options } from '../../interfaces/dream.interfaces.js'

// Wipe db and save data
let userOneAuth: [string, string]
let newDreamId: Types.ObjectId
let userThreeAuth: [string, string]
let url: string
// Wipe db and save data
beforeEach(async () => {
    await wipeDB()

    // Create two users to test authorized vs unauthorized cases
    const userOne = await createUser(userOneCreds)
    userOneAuth = getAuthHeader(userOne.tokens[0])
    const userThree = await createUser(userThreeCreds)
    userThreeAuth = getAuthHeader(userThree.tokens[0])

    // Create a dream owned by userThree
    const newDream = await new Dream({...newDreamData, owner: userOne._id}).save()
    newDreamId = newDream._id

    // Add analysis to dream
    const analysisData = {
        text: 'Being chased by a dog in a dream could symbolize fear of the future or a feeling of being trapped.',
        tone: options.tone[0],
        style: options.style[0],
        length: options.length[0],
        descriptionSnapshot: newDreamData.description
    }
    newDream.analyses.push(analysisData)
    const dream = await newDream.save()
    const analysisRecord = dream.analyses[0]

    url = baseUrl + `/delete/${newDreamId}/analyses/${analysisRecord._id}`
})

// Tests

test('Deleting analysis should fail if user is not owner of dream.', async () => {
    const response = await request(server).delete(url).set(...userThreeAuth).expect(403)
    assertSingleError(response.body.errors, 'You are not authorized to delete this analysis.')
})

test('Deleting analysis should succeed if user is owner.', async () => {
    // Assert dream has analysis
    const dream = await Dream.findByIdOrThrowError(newDreamId.toString())
    expect(dream.analyses).toHaveLength(1)
    const response = await request(server).delete(url).set(...userOneAuth).expect(200)
    expect(response.body.modifiedCount).toBe(1)
    // Assert analysis has been removed
    const updatedDream = await Dream.findByIdOrThrowError(newDreamId.toString())
    expect(updatedDream.analyses).toHaveLength(0)

})