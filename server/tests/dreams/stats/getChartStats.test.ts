import request from 'supertest';
import { server } from '../../setup/testServer.js'
import { beforeEach, expect, test, describe } from 'vitest';
import { userOneCreds, userThreeCreds  } from '../../users/data.js';
import { createUser, getAuthHeader } from '../../users/utils/userCreation.js'
import { wipeDB } from '../../setup/wipeDB.js'
import {baseUrl } from '../utils.js';
import { Dream } from '../../../models/dream.model.js';
import { Types } from 'mongoose';

let userOneAuth: [string, string]
let userOneId: Types.ObjectId
let userThreeId: Types.ObjectId
let userThreeAuth: [string, string]

const now = new Date()
const currentYear = now.getFullYear()

// Wipe db and save data
beforeEach(async () => {
    await wipeDB()

    const userOne = await createUser(userOneCreds)
    userOneAuth = getAuthHeader(userOne.tokens[0])
    userOneId = userOne._id
    const userThree = await createUser(userThreeCreds)
    userThreeId = userThree._id
    userThreeAuth = getAuthHeader(userThree.tokens[0])

    // Save dreams associated with userOne in last 8 months using dynamic date range
    for (let i=7; i>=0; i--){
        if (i === 1 || i === 3){
            continue
        }
        const date = new Date(now.getFullYear(), now.getMonth() - i, 10)
        await new Dream({
            title: `Dream 1 in month ${i}`,
            date,
            owner: userOneId
        }).save()
        if (i === 2){
        await new Dream({
            title: `Dream 2 in month ${i}`,
            date,
            owner: userOneId
        }).save()            
        }
    }

    // Save dreams associated with userThree that all lie outside range
    const beforeRange = new Date(now.getFullYear(), now.getMonth() - 10, 10)
    await new Dream({
        title: `Dream before range`,
        date: beforeRange,
        owner: userThreeId
    }).save()       
    const afterRange = new Date()
    await new Dream({
        title: `Dream after range`,
        date: afterRange,
        owner: userThreeId
    }).save()  
})

// Define url
const url = baseUrl + '/chart-stats'

type countsType = { month: number, label: string, year: number, dreams: number }

const monthNames = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
]
        
describe('Get dreams per month should return correct results when:', () => {
    test('Dreams exist outside of 6 month range and some months in range have no dreams.', async () => {
        const response = await request(server).get(`${url}`).set(...userOneAuth)
        const counts: countsType[] = response.body.dreamCounts
        counts.map((c, index) => {
            const date = new Date(currentYear, now.getMonth() - 6 + index, 10)
            expect(c.month).toBe(date.getMonth() + 1)
            expect(c.year).toBe(date.getFullYear())
            expect(c.label).toBe(monthNames[date.getMonth()])
            if (index === 3 || index === 5){
                return expect(c.dreams).toBe(0)
            }
            if (index === 4){
                return expect(c.dreams).toBe(2)
            }
        })
    })
    test('No dreams exist inside 6 month range.', async () => {
        const response = await request(server).get(`${url}`).set(...userThreeAuth)
        const counts: countsType[] = response.body.dreamCounts
        expect(counts).toHaveLength(0)
    })
})
