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
import { AnalysisInterface, options } from '../../interfaces/dream.interfaces.js'

// Wipe db and save data
let userOneAuth: [string, string]
let newDreamId: Types.ObjectId
let userThreeAuth: [string, string]
let analysisOne: AnalysisInterface
let analysisTwo: AnalysisInterface

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
    analysisOne = {
        text : 'Being chased by a dog in a dream could symbolize fear of the future or a feeling of being trapped.',
        tone: options.tone[0],
        style: options.style[0],
        length: options.length[0],
        descriptionSnapshot: newDreamData.description
    }
    analysisTwo = {
        text : 'Being chased by a dog in a dream could indicate feelings of losing control.',
        tone: options.tone[1],
        style: options.style[1],
        length: options.length[1],
        descriptionSnapshot: newDreamData.description,
        isFavorite: true
    }
    newDream.analyses.push(analysisOne)
    newDream.analyses.push(analysisTwo)
    await newDream.save()

})

// Define url
const url = baseUrl + '/analyses' 

test('Get analyses should fail if user is not owner of dream.', async () => {
    const response = await request(server).get(`${url}/${newDreamId}`).set(...userThreeAuth)
    assertSingleError(response.body.errors, 'You are not authorized to view analyses for this dream.')
})

test('Get analyses should succeed if user is owner of dream, and correct data is returned.', async () => {
    const response = await request(server).get(`${url}/${newDreamId}`).set(...userOneAuth)
    const analyses = response.body.analyses
    expect(analyses).toHaveLength(2)
    expect(analyses[0]).toMatchObject({
        ...analysisOne, 
        modelUsed: 'gpt-5-nano', 
        descriptionSnapshot: newDreamData.description, 
        isFavorite: false,
    })
    expect(analyses[1]).toMatchObject({
        ...analysisTwo, 
        modelUsed: 'gpt-5-nano', 
        descriptionSnapshot: newDreamData.description
    })
})