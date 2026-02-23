import request from 'supertest';
import { beforeEach, expect, test } from 'vitest';
import { wipeDB } from '../setup/wipeDB.js'
import { server } from '../setup/testServer.js'
import { userOneCreds } from '../users/data.js';
import {createUser, getAuthHeader} from '../users/utils/userCreation.js'
import { baseUrl } from './utils.js';
import { assertSingleError } from '../users/utils/assertErrors.js';

let userOneAuth: [string, string]

// Wipe db and save data
beforeEach(async () => {
    await wipeDB()

    // Create two users to test authorized case vs unauthorized
    const userOne = await createUser(userOneCreds)
    userOneAuth = getAuthHeader(userOne.tokens[0])
})

// Define url
const url = baseUrl + '/analysis' 

// Tests

test('Generate analysis fails if dream description is not provided.', async () => {
    // Error should be returned
    const response = await request(server).post(url).send({title: 'A dream title'}).set(...userOneAuth).expect(400)
    assertSingleError(response.body.errors, 'Description must be provided.', 'description')
})

test('Correct mock response is returned if dream description and tone and style parameters are provided.', async () => {
    // Mock response is returned based on tone and style parameters
    const response = await request(server).post(url).send({
        description: 'A dream description.',
        params: {
            tone: 'serious',
            style: 'formal'            
        }
    }).set(...userOneAuth).expect(200)
    expect(response.body.analysis).toBe('Mock analysis response. Description: A dream description. Tone: serious. Style: formal.')
}) 

test('Correct mock response is returned if dream description and only tone parameter is provided.', async () => {
    // Mock response is returned based on tone and style parameters
    const response = await request(server).post(url).send({
        description: 'A dream description.',
        params: {
            tone: 'serious',         
        }
    }).set(...userOneAuth).expect(200)
    expect(response.body.analysis).toBe('Mock analysis response. Description: A dream description. Tone: serious. Style: No style provided.')
}) 

test('Correct mock response is returned if dream description and only tone parameter is provided.', async () => {
    // Mock response is returned based on tone and style parameters
    const response = await request(server).post(url).send({
        description: 'A dream description.',
        params: {
            style: 'formal',         
        }
    }).set(...userOneAuth).expect(200)
    expect(response.body.analysis).toBe('Mock analysis response. Description: A dream description. Tone: No tone provided. Style: formal.')
})  

test('Correct mock response is returned if dream description and no ai parameters are provided.', async () => {
    // Mock response is returned based on tone and style parameters
    const response = await request(server).post(url).send({
        description: 'A dream description.',
    }).set(...userOneAuth).expect(200)
    expect(response.body.analysis).toBe('Mock analysis response. Description: A dream description.')    
})