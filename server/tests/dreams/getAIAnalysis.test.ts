import request from 'supertest';
import { beforeEach, describe, expect, test } from 'vitest';
import { wipeDBAndSaveData } from '../setup/setupData.js'
import { server } from '../setup/testServer.js'
import { userOneAuth } from '../users/data.js';
import { baseUrl } from './utils.js';

// Wipe db and save data
beforeEach(async () => {
    await wipeDBAndSaveData()
})

describe('GET ANALYSIS', () => {
    // Define url
    const url = baseUrl + '/analysis' 

    test('Generate analysis fails if dream description is not provided.', async () => {
        // Error should be returned
        const response = await request(server).post(url).send({dream: {title: 'A dream title'}}).set(...userOneAuth).expect(400)
        expect(response.body.error).toBe("Description must be provided.")
    })
    test('Mock response is returned if dream description is provided.', async () => {
        // Mock response is returned based on tone and style parameters
        const response = await request(server).post(url).send({
            description: 'A dream description',
            tone: 'serious',
            style: 'formal'
        }).set(...userOneAuth).expect(200)
        expect(response.body.analysis).toBe('Mock analysis response. Description: A dream description Tone: serious, Style: formal.')
    })  
})