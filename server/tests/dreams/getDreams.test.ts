import request from 'supertest';
import { server } from '../setup/testServer.js'
import { beforeEach, describe, expect, test } from 'vitest';
import { userOneAuth, userThreeAuth  } from '../users/data.js';
import { oldDream, newDream } from './data.js';
import { wipeDBAndSaveData } from '../setup/setupData.js'
import { assertDreamTitlesAndDates, baseUrl, filterAndAssertDreams } from './utils.js';

// Wipe db and save data
beforeEach(async () => {
    await wipeDBAndSaveData()
})

// Get dreams
describe('GET ALL DREAMS', () => {
    // Define url
    const url = baseUrl
    
    test("All dreams should be returned when no parameters are passed in.", async () => {
        // Get all userOne's dreams
        const response = await request(server).get(`${url}`).set(...userOneAuth).expect(200)
        expect(response.body.dreams).toHaveLength(9)
    })

    test("Skip, limit and title parameters return correct dreams.", async () => {
        // Get dream page one of dreams
        const pageOneResponse = await request(server).get(`${url}?limit=5&skip=0&year=2025&month=6`).set(...userOneAuth).expect(200)
        // Should be 5 dreams, sorted oldest to newest
        const pageOneDreams = pageOneResponse.body.dreams
        assertDreamTitlesAndDates(pageOneDreams, 5)
        // Get dream page two of dreams
        const pageTwoResponse = await request(server).get(`${url}?limit=5&skip=5&year=2025&month=6`).set(...userOneAuth).expect(200)
        // Should be 4 dreams, starting at dream4, sorted oldest to newest
        const pageTwoDreams = pageTwoResponse.body.dreams
        assertDreamTitlesAndDates(pageTwoDreams, 4, 4)
        // Should only return dream9
        const singleResponse = await request(server).get(`${url}?limit=5&skip=0&title=dream9&year=2025&month=6`).set(...userOneAuth).expect(200)
        const singleDreamArray = singleResponse.body.dreams
        expect(singleDreamArray).toHaveLength(1)
        expect(singleDreamArray[0].title).toBe('dream9')
    })

    test('Searching by title returns correct dreams.', async () => {
        // Searching 'In space should return all 3 of userThree dreams
        const allDreamsResponse = await request(server).get(`${url}?title=In space`).set(...userThreeAuth).expect(200)
        const allDreams = allDreamsResponse.body.dreams
        expect(allDreams).toHaveLength(3)
        // Searching 'In space without' should return 1 dream
        const singleDreamResponse = await request(server).get(`${url}?title=In space without`).set(...userThreeAuth).expect(200)
        const singleDream = singleDreamResponse.body.dreams
        expect(singleDream).toHaveLength(1)
        expect(singleDream[0].title).toBe('In space without a space suit')
        // Searching 'space suit' should return 2 dreams
        const twoDreamResponse = await request(server).get(`${url}?title=space suit`).set(...userThreeAuth).expect(200)
        const twoDreams = twoDreamResponse.body.dreams
        expect(twoDreams).toHaveLength(2)
        // Should be sorted newest to oldest
        expect(twoDreams[0].title).toBe('In space wearing a space suit')
        expect(twoDreams[1].title).toBe('In space without a space suit')
    })

    test('Setting month and year returns correct dreams.', async () => {
        await filterAndAssertDreams(2024, 12, 1, [oldDream.title])
        await filterAndAssertDreams(2025, 5, 1, [newDream.title])
        await filterAndAssertDreams(2025, 6, 3, ['In space wearing a space suit', 'In space without a space suit', 'In space'])
        await filterAndAssertDreams(2020, 2, 0)
    })
})