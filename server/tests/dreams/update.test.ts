import request from 'supertest';
import { beforeEach, describe, expect, test } from 'vitest';
import { wipeDB } from '../setup/wipeDB.js'
import { server } from '../setup/testServer.js'
import { userOneCreds, userThreeCreds } from '../users/data.js';
import { createUser, getAuthHeader } from '../users/utils/userCreation.js'
import { oldDreamData, dreamWithNoDescData } from './data.js';
import { Theme } from '../../models/theme.model.js';
import { Dream } from '../../models/dream.model.js';
import { baseUrl } from './utils.js';
import { Types } from 'mongoose';
import { assertSingleError } from '../users/utils/assertErrors.js';

// Wipe db and save data
let userOneAuth: [string, string]
let userOneId: Types.ObjectId
let userThreeAuth: [string, string]
let oldDreamId: Types.ObjectId
let dreamWithNoDescId: Types.ObjectId

// Wipe db and save data
beforeEach(async () => {
    await wipeDB()

    // Create two users to test authorized vs unauthorized updates
    const userOne = await createUser(userOneCreds)
    userOneAuth = getAuthHeader(userOne.tokens[0])
    userOneId = userOne._id
    const userThree = await createUser(userThreeCreds)
    userThreeAuth = getAuthHeader(userThree.tokens[0])

    // Create a dream owned by userThree
    const oldDream = await new Dream({...oldDreamData, owner: userThree._id}).save()
    oldDreamId = oldDream._id

    // Create themes associated with old dream
    await new Theme({theme: 'Lateness', dream: oldDreamId, owner: userThree._id}).save()
    await new Theme({theme: 'Anxiety', dream: oldDreamId, owner: userThree._id}).save()

    // Create a dream with no description
    const dreamWithNoDesc = await new Dream({...dreamWithNoDescData, owner: userThree._id}).save()
    dreamWithNoDescId = dreamWithNoDesc._id
})

// Define url
const url = baseUrl + '/update'

// Update dream
describe('Updating dream should fail if:', () => {

    test('Request body does not contain "dream" as a field.', async () => {
        const response = await request(server).patch(`${url}/${oldDreamId}`).send({
            title: 'Dream title'
        }).set(...userThreeAuth).expect(400)
        assertSingleError(response.body.errors, "Request body must contain the field 'dream'.")
    })

    // User cannot update another users dream
    test('Update dream should fail if user is not owner of dream.', async () => {
        const response = await request(server).patch(`${url}/${oldDreamId}`).send({
            dream: {title: 'Dream title'}
        }).set(...userOneAuth).expect(403)
        assertSingleError(response.body.errors, 'You are not authorized to edit this dream.')
    })

    test('Update dream should fail if title is null.', async () => {
        const response = await request(server).patch(`${url}/${oldDreamId}`).send({
            dream: {title: null, description: null, date: '2024-11-30T00:00:00.000Z'}
        }).set(...userThreeAuth).expect(400)
        assertSingleError(response.body.errors, "Dream data must contain title.", 'dream.title')
    })
})

describe('Updating dream should succeed if:', () => {

    test('Valid data is provided. All fields can be changed and themes added.', async () => {
        // Assert theme 'Travel' associated with oldDreamId is not yet in database
        let theme = await Theme.findOne({dream: oldDreamId, theme: 'Travel'})
        expect(theme).toBeNull()
        // Send valid data with correct authentication, changing every field
        const update = {
            title: 'Missed train',
            description: 'I slept in and missed my train. I had to get the next one.',
            date: '2024-11-30T00:00:00.000Z',
            notes: 'The dream woke me up.',
            analysis: 'Interesting'
        }
        const response = await request(server).patch(`${url}/${oldDreamId}`).send({
            dream: update, 
            themes: ['Lateness', 'Anxiety', 'Travel']
        }).set(...userThreeAuth).expect(200)
        // Dream data should be in response, title, description, date, notes and analysis changed
        expect(response.body.dream).toMatchObject(update)
        // Existing Themes and new theme should be in response
        const themes = response.body.themes
        expect(themes).toHaveLength(3)
        const returnedThemeNames = themes.map((t: { theme: string }) => t.theme)
        expect(returnedThemeNames).toEqual(
            expect.arrayContaining(['Lateness', 'Anxiety', 'Travel'])
        )
        // Database should have been changed
        const savedDream = await Dream.findByIdOrThrowError(oldDreamId.toString())
        const {title,
            description,
            date,
            notes,
            analysis,
        } = savedDream
        expect({title,
            description,
            date,
            notes,
            analysis,
        }).toMatchObject({...update, date: new Date(update.date)})
        // Theme should have been added
        theme = await Theme.findOne({dream: oldDreamId, theme: 'Travel'})
        expect(theme).not.toBeNull()
    })

    test('Description is removed. Themes should also be removed.', async () => {
        // Assert that dream has themes
        let themes = await Theme.find({dream: oldDreamId})
        expect(themes).toHaveLength(2)
        // Remove description
        const response = await request(server).patch(`${url}/${oldDreamId}`).send({
            dream: {title: 'Missed Train', description: null}
        }).set(...userThreeAuth).expect(200)
        // Response should contain dream and empty themes array
        expect(response.body).toHaveProperty('themes')
        expect(response.body).toHaveProperty('dream')
        expect(response.body.themes).toHaveLength(0)
        // Dream description should be removed
        const dream = await Dream.find(oldDreamId)
        expect(dream).not.toHaveProperty('description')
        // No themes should be associated with the dream
        themes = await Theme.find({dream: oldDreamId})
        expect(themes).toHaveLength(0)
    })

    test('Dream has no description. Other fields can be updated, and themes are not generated.', async () => {
        // Send valid data with no description
        const response = await request(server).patch(`${url}/${dreamWithNoDescId}`).send({
            dream: {title: 'Still a dream with no description.'}
        }).set(...userThreeAuth).expect(200)
        // Response should contain dream and not contain themes
        expect(response.body).toHaveProperty('themes')
        expect(response.body).toHaveProperty('dream')
        expect(response.body.themes).toHaveLength(0)
        // No themes should be associated with the dream
        const savedThemes = await Theme.find({dream:dreamWithNoDescId})
        expect(savedThemes).toHaveLength(0)
    })
})