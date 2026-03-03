import request from 'supertest';
import { server } from '../setup/testServer.js'
import { beforeEach, describe, expect, test } from 'vitest';
import { userOneCreds  } from '../users/data.js'
import { createUser, getAuthHeader } from '../users/utils/userCreation.js';
import { wipeDB } from '../setup/wipeDB.js'
import { Dream } from '../../models/dream.model.js';
import { findDreamAndSaveTheme } from './utils.js';

let userOneAuth: [string, string]

const now = new Date()
const currentYear = now.getFullYear()
const currentMonth = now.getMonth()


const topThemes = ['Fear', 'Nature', 'Adventure', 'Animals', 'Freedom']
const otherThemes = ['People', 'Survival']

// Wipe db and save data
beforeEach(async () => {
    await wipeDB()

    // Save a user to own dreams and saves
    const userOne = await createUser(userOneCreds)
    const userOneId = userOne._id.toString()
    userOneAuth = getAuthHeader(userOne.tokens[0])

    // Define titles for easy lookup when saving themes
    const dreamTitles = []
    const dreamIds: string[] = []
    for (let i=0; i < 5; i++){
        dreamTitles.push(`Dream ${i}`)
    }

    // Save two dreams in each month
    await Promise.all(dreamTitles.map(async (title, index) => {
        const date = new Date(currentYear, currentMonth - index - 1, 27)
        const dream = await new Dream({
            title,
            date,
            owner: userOneId
        }).save()
        dreamIds.push(dream._id.toString())
    }))

    await Promise.all(dreamTitles.map(async (title, index) => {
        // Define month dynamically so tests aren't time dependent
        const date = new Date(currentYear, currentMonth - index - 1, 27)
        const dream = await new Dream({
            title: title + '-a',
            date,
            owner: userOneId
        }).save()
        dreamIds.push(dream._id.toString())
    }))

    // Save top themes across months
    await Promise.all(topThemes.map(async (theme, index) => {
        await findDreamAndSaveTheme(theme, `Dream ${index}`, userOneId.toString())
        // Fear is saved to a dream in currMonth - 1 and currMonth - 2
        if (theme === 'Fear'){
            await findDreamAndSaveTheme(theme, `Dream ${index + 1}`, userOneId.toString())            
        }
        // Nature is saved to two dreams in currMonth - 2
        // Freedom is saved to two dreams in currMonth - 5
        if (theme === 'Nature' || theme === 'Freedom'){
            await findDreamAndSaveTheme(theme, `Dream ${index}-a`, userOneId.toString())            
        }
    }))

    // Save other themes to test exlusion
    await Promise.all(otherThemes.map(async (theme) => {
        await findDreamAndSaveTheme(theme, 'Dream 1', userOneId.toString())
    }))

})

const expectedCounts = [
    {
        Fear: 0,
        Freedom: 0,
        Nature: 0,
        Adventure: 0,
        Animals: 0
    }, {
        Fear: 0,
        Freedom: 2,
        Nature: 0,
        Adventure: 0,
        Animals: 0
    }, {
        Fear: 0,
        Freedom: 0,
        Nature: 0,
        Adventure: 0,
        Animals: 1        
    }, {
        Fear: 0,
        Freedom: 0,
        Nature: 0,
        Adventure: 1,
        Animals: 0        
    }, {
        Fear: 1,
        Freedom: 0,
        Nature: 2,
        Adventure: 0,
        Animals: 0
    }, {
        Fear: 1,
        Freedom: 0,
        Nature: 0,
        Adventure: 0,
        Animals: 0        
    }
]


const url = '/api/themes/chart-stats'

// Tests

type ResponseType = {
    body:{
        themes: string[],
        data: {
            [key: string]: string | number
        }[]
    }
}
 
describe('Get theme chart stats should:',  () => {
    let response: ResponseType

    beforeEach(async () => {
        response = await request(server).get(`${url}`).set(...userOneAuth).expect(200)
    })

    test('Return top 5 themes in correct order.', () => {
        expect(response.body.themes).toEqual([
            'Fear', 'Freedom', 'Nature', 'Adventure', 'Animals'
        ])
    })

    test('Only show data for themes in top 5.', () => {
        expect(response.body.data.map(counts => {
            topThemes.map(theme => 
                expect(counts).toHaveProperty(theme)
            )
            otherThemes.map(theme => 
                expect(counts).not.toHaveProperty(theme)
            )
        }))
    })

    test('Have the correct months as labels and have the correct counts per month for each theme.', () => {
        const data = response.body.data
        data.map((entry, index) => {
            const j = 6 - index
            const date = new Date(currentYear, currentMonth - j, 27)
            // Correct month
            const monthName = date.toLocaleString('en-US', { month: 'short' })
            expect(entry.month).toBe(monthName)
            // Correct theme counts
            expect(entry).toMatchObject(expectedCounts[index])
        })
    })
})
