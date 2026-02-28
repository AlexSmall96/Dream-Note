import request from 'supertest';
import { server } from '../setup/testServer.js'
import { beforeEach, expect, test } from 'vitest';
import { userOneCreds, userThreeCreds  } from '../users/data.js';
import { createUser, getAuthHeader } from '../users/utils/userCreation.js'
import { wipeDB } from '../setup/wipeDB.js'
import {baseUrl } from './utils.js';
import { Dream } from '../../models/dream.model.js';
import { Types } from 'mongoose';

let userOneAuth: [string, string]
let userOneId: Types.ObjectId
let userThreeAuth: [string, string]

const NOW = new Date()
const currentYear = NOW.getFullYear()

// Wipe db and save data
beforeEach(async () => {
    await wipeDB()

    const userOne = await createUser(userOneCreds)
    userOneAuth = getAuthHeader(userOne.tokens[0])
    userOneId = userOne._id
    const userThree = await createUser(userThreeCreds)
    userThreeAuth = getAuthHeader(userThree.tokens[0])

    // Save two dreams fall within last 4 weeks using dynamic date
    const startDate = new Date(NOW.getTime() - 27 * 24 * 60 * 60 * 1000)
    await new Dream({
        title: 'Dream 1 in past month',
        date: startDate,
        owner: userOneId
    }).save()
    await new Dream({
        title: 'Dream 2 in past month',
        date: startDate,
        owner: userOneId
    }).save()

    // Save dreams from 2025 using fixed dates to test monthly totals
    for (let i=0; i<12; i++){
        const date = new Date(2025, i, 5)
        await new Dream({
            title: `dream in month ${i}`,
            date,
            owner: userOneId
        }).save()
        if (i === 0 || i === 1){
            await new Dream({
                title: `dream 1 in month ${i}`,
                date,
                owner: userOneId
            }).save()            
        }
        if (i === 0){
            await new Dream({
                title: `dream 2 in month ${i}`,
                date,
                owner: userOneId
            }).save()           
        }
    }
})

// Define url
const url = baseUrl + '/stats'

// Tests

test('Number of dreams in the past month should be correct.', async () => {
    const response = await request(server).get(`${url}?year=${currentYear}`).set(...userOneAuth)
    expect(response.body.thisMonthTotal).toBe(2)
})  

test('Monthly totals should be correct for each month.', async () => {
    const response = await request(server).get(`${url}?year=${2025}`).set(...userOneAuth)
    // Should be 3 in Jan, 2 in Feb, 1 in each of the rest
    for (let i=1; i<13; i++){
        expect(response.body.monthlyTotals[i]).toBe(i === 1 ? 3 : i === 2 ? 2 : 1)
    }
})

test('All time total should be correct.', async () => {
    const response = await request(server).get(`${url}`).set(...userOneAuth)
    expect(response.body.total).toBe(17)
})