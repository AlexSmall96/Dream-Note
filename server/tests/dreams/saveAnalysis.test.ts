import request from 'supertest';
import { beforeEach, expect, test, describe } from 'vitest';
import { wipeDB } from '../setup/wipeDB.js'
import { server } from '../setup/testServer.js'
import { userOneCreds, userThreeCreds } from '../users/data.js';
import {createUser, getAuthHeader} from '../users/utils/userCreation.js'
import { baseUrl } from './utils.js';
import { assertSingleError } from '../users/utils/assertErrors.js';
import { Types } from 'mongoose';
import { Dream } from '../../models/dream.model.js';
import { newDreamData, dreamWithNoDescData } from './data.js';
import { options } from '../../interfaces/dream.interfaces.js'

// Wipe db and save data
let userOneAuth: [string, string]
let newDreamId: Types.ObjectId
let userThreeAuth: [string, string]
let noDescId: Types.ObjectId

// Wipe db and save data
beforeEach(async () => {
    await wipeDB()

    // Create two users to test authorized vs unauthorized saving
    const userOne = await createUser(userOneCreds)
    userOneAuth = getAuthHeader(userOne.tokens[0])
    const userThree = await createUser(userThreeCreds)
    userThreeAuth = getAuthHeader(userThree.tokens[0])

    // Create a dream owned by userThree
    const newDream = await new Dream({...newDreamData, owner: userOne._id}).save()
    newDreamId = newDream._id

    // Create a dream to test saving analysis to a dream with no description
    const noDesc = await new Dream({...dreamWithNoDescData, owner: userOne._id}).save()
    noDescId = noDesc._id
})

// Define url
const url = baseUrl + '/analysis' 
const text = 'Being chased by a dog in a dream could symbolize fear of the future or a feeling of being trapped.'

// Tests
describe('Saving analysis should fail if:', async () => {
    test('Request body is missing tone.', async () => {
        const response = await request(server).post(`${url}/${newDreamId}`).send({
            text,    
            style: options.style[0],
            length: options.length[0]
        }).set(...userOneAuth).expect(400)
        assertSingleError(response.body.errors, "Request body must contain the field 'tone'", 'tone')
    })
    test('Request body is missing style.', async () => {
        const response = await request(server).post(`${url}/${newDreamId}`).send({
            text,    
            tone: options.tone[0],
            length: options.length[0]
        }).set(...userOneAuth).expect(400)
        assertSingleError(response.body.errors, "Request body must contain the field 'style'", 'style')
    })
    test('Request body is missing length.', async () => {
        const response = await request(server).post(`${url}/${newDreamId}`).send({
            text,    
            tone: options.tone[0],
            style: options.style[0],
        }).set(...userOneAuth).expect(400)
        assertSingleError(response.body.errors, "Request body must contain the field 'length'", 'length')
    })
    test('User is not owner of dream.', async () => {
        const response = await request(server).post(`${url}/${newDreamId}`).send({
            text,    
            tone: options.tone[0],
            style: options.style[0],
            length: options.length[0]

        }).set(...userThreeAuth).expect(403)
        assertSingleError(response.body.errors, "You are not authorized to add analyses to this dream.")        
    })
    test('Dream has no description.', async () => {
        const response = await request(server).post(`${url}/${noDescId}`).send({
            text,    
            tone: options.tone[0],
            style: options.style[0],
            length: options.length[0]

        }).set(...userOneAuth).expect(422)
        assertSingleError(response.body.errors, 'Dream must have a description to save analysis.')         
    })
})


test('Saving analysis should succeed if valid data is provided.', async () => {
    const body = {
        text: 'Being chased by a dog in a dream could symbolize fear of the future or a feeling of being trapped.',
        tone: options.tone[0],
        style: options.style[0],
        length: options.length[0]
    }
    const response = await request(server).post(`${url}/${newDreamId}`).send(body).set(...userOneAuth).expect(201)
    // Assert response matches request body
    expect(response.body).toMatchObject({...body, modelUsed: 'gpt-5-nano'})
    // Assert that dream now has analysis saved with correct default values
    const dream = await Dream.findByIdOrThrowError(newDreamId.toString())
    const analyses = dream.analyses
    expect(analyses).toHaveLength(1)
    expect(analyses[0]).toMatchObject({...body, modelUsed: 'gpt-5-nano', descriptionSnapshot: newDreamData.description})
    const NOW = new Date().toString()
    const savedDate = analyses[0].createdAt?.toString()
    expect(savedDate?.substring(0, 15)).toEqual(NOW.substring(0, 15))
    expect(analyses[0].isFavorite).toBe(false)
})