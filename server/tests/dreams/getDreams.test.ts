import request from 'supertest';
import { server } from '../setup/testServer.js'
import { beforeEach, expect, test } from 'vitest';
import { userOneCreds, userThreeCreds  } from '../users/data.js';
import { createUser, getAuthHeader } from '../users/utils/userCreation.js'
import { wipeDB } from '../setup/wipeDB.js'
import { assertDreamTitlesAndDates, baseUrl, filterAndAssertDreams } from './utils.js';
import { oldDreamData, newDreamData } from './data.js';
import { Dream } from '../../models/dream.model.js';
import { Types } from 'mongoose';

let userOneAuth: [string, string]
let userOneId: Types.ObjectId
let userThreeAuth: [string, string]
let oldDreamTitle: string
let newDreamTitle: string
const currentYear = new Date().getFullYear()

// Wipe db and save data
beforeEach(async () => {
    await wipeDB()

    // Create two users to test pagination, search functionality and date filter
    const userOne = await createUser(userOneCreds)
    userOneAuth = getAuthHeader(userOne.tokens[0])
    userOneId = userOne._id
    const userThree = await createUser(userThreeCreds)
    userThreeAuth = getAuthHeader(userThree.tokens[0])

    // For pagination:
    const userOneTitles: string[] = []
    const n = 10
    for (let i=1; i<n; i++){
        userOneTitles.push(`dream${i}`)
    }
    
    await Promise.all(
        userOneTitles.map(async (title, index) => {
            const date = new Date(Date.UTC(currentYear, 5, index + 1))
            await new Dream({title, date, owner: userOne._id}).save()
        })
    )

    // For title search:
    const userThreeTitles = ['In space', 'In space without a space suit', 'In space wearing a space suit']
    await Promise.all(
        userThreeTitles.map(async (title, index) => {
            const date = new Date(Date.UTC(currentYear, 5, index + 1))
            await new Dream({title, owner: userThree._id, date}).save()
        })
    )

    // For date (month & year) filtering
    const oldDream = await new Dream({...oldDreamData, owner: userThree._id}).save()
    oldDreamTitle = oldDream.title
    const newDream = await new Dream({...newDreamData, owner: userThree._id}).save()
    newDreamTitle = newDream.title

})

// Define url
const url = baseUrl

// Tests

test("All dreams in current year should be returned when no parameters are passed in.", async () => {
    // Get all userOne's dreams
    const response = await request(server).get(`${url}`).set(...userOneAuth).expect(200)
    expect(response.body.dreams).toHaveLength(9)
})

test("Skip and limit parameters return correct dreams.", async () => {
    // Get dream page one of dreams
    const pageOneResponse = await request(server).get(`${url}?limit=5&skip=0&year=${currentYear}&month=6`).set(...userOneAuth).expect(200)
    // Should be 5 dreams, sorted oldest to newest
    const pageOneDreams = pageOneResponse.body.dreams
    assertDreamTitlesAndDates(pageOneDreams, 5)
    // Get dream page two of dreams
    const pageTwoResponse = await request(server).get(`${url}?limit=5&skip=5&year=${currentYear}&month=6`).set(...userOneAuth).expect(200)
    // Should be 4 dreams, starting at dream4, sorted oldest to newest
    const pageTwoDreams = pageTwoResponse.body.dreams
    assertDreamTitlesAndDates(pageTwoDreams, 4, 4)
    // Should only return dream9
    const singleResponse = await request(server).get(`${url}?limit=5&skip=0&title=dream9&year=${currentYear}&month=6`).set(...userOneAuth).expect(200)
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
    await filterAndAssertDreams(2024, 12, 1, userThreeAuth, [oldDreamTitle])
    await filterAndAssertDreams(2025, 5, 1, userThreeAuth,  [newDreamTitle])
    await filterAndAssertDreams(currentYear, 6, 3, userThreeAuth, ['In space wearing a space suit', 'In space without a space suit', 'In space'])
    await filterAndAssertDreams(2020, 2, 0, userThreeAuth)
})
