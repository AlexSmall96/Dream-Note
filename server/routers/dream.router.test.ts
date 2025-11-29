import request from 'supertest';
import { server } from '../utils/test-utils/testServer.js'
import { wipeDBAndSaveData, userOneId, userOneAuth } from '../utils/test-utils/testData.js'
import { beforeEach, describe, expect, test } from 'vitest';
import { Dream } from '../models/dream.model.js';
import { Theme } from '../models/theme.model.js';

// Wipe db and save data
beforeEach(async () => wipeDBAndSaveData())

// Define base url for dream router
const baseUrl = '/api/dreams'

// Helper function to assert an array of themes have been added to the db
// Checks they are associated with the correct dream
const assertThemesInDB = (themes: string[], dreamId: string) => {
    themes.forEach(async (theme) => {
        const savedTheme = await Theme.findByThemeOrThrowError(theme)
        expect(savedTheme).not.toBeNull()
        expect(savedTheme.dream.toString()).toBe(dreamId)
    })   
}

// Tests 

// Log dream
describe('LOG NEW DREAM', () => {
    // Define url
    const url = baseUrl + '/log'

    // Define default themes sent back from dev version of openAI API
    const defaultThemes = ['theme1', 'theme2', 'theme3']

    test('Logging new dream should fail if title and description are missing.', async () => {
        // Send incomplete data
        const response = await request(server).post(url).send({dream: {}}).set(...userOneAuth).expect(400)
        // Correct error message is returned
        expect(response.body.error).toBe('At least one of title or description is required.')
    })

    test('Logging new dream should succeed if description is provided, with title and themes generated from dev version of openAI API.', async () => {
        // Assert that no dreams with the correct title are found in DB
        let savedDream = await Dream.findOne({title:'I had a dream I was flying. It...'})
        expect(savedDream).toBeNull()
        // Assert that no themes are found in DB yet
        const themes = await Theme.find()
        expect(themes).toHaveLength(0)
        // Send data with description and no title
        const description = 'I had a dream I was flying. It was very exciting.'
        const response = await request(server).post(url).send({
            dream: { description }
        }).set(...userOneAuth).expect(201)
        // Title should be first 30 characters of description.
        const dream = response.body.dream
        expect(dream.title).toBe('I had a dream I was flying. It...')
        // Description and default themes should be present in response
        expect(dream.description).toBe(description)
        expect(response.body.themes).toEqual(defaultThemes)
        // Owner should be userOne's id
        expect(dream.owner).toBe(userOneId.toString())
        // Assert that the dream was added to the database
        savedDream = await Dream.findOne({title:'I had a dream I was flying. It...'})
        expect(savedDream).not.toBeNull()
        // Assert that the themes were added to the database and associated with the correct dream
        assertThemesInDB(defaultThemes, response.body.dream._id.toString())
    })

    test('Logging new dream should succeed if description, title and themes are provided, with no data from dev version of openAI API.', async () => {
        // Define data
        const title = 'Flying dream'
        const description = 'I had a dream I was flying. It was very exciting.'
        const themes = ['Freedom', 'Adventure', 'Fun']
        const notes = "I didn't drink any coffee that day."
        const date = '2025-01-01T10:50:13.849Z'
        // Assert that no dreams with the correct title are found in DB
        let savedDream = await Dream.findOne({title}) 
        expect(savedDream).toBeNull()
        // Send data with description, title and themes
        const response = await request(server).post(url).send({dream: { title, description, notes, date}, themes}).set(...userOneAuth).expect(201)
        // Description, title and themes should be present in response
        expect(response.body.dream).toMatchObject({ title, description, notes, date})
        expect(response.body.themes).toEqual(themes)
        // Asert that the dream was saved to the database
        savedDream = await Dream.findOne({title}) 
        expect(savedDream).not.toBeNull()
        // Assert the themes were added to the database
        assertThemesInDB(themes, response.body.dream._id.toString())       
    })

    test('Logging new dream should succeed if title is provided, with themes generated from dev version of openAI API and no description.', async () => {
        // Assert that no dreams with the correct title are found in DB
        let savedDream = await Dream.findOne({title: 'Flying dream'})
        expect(savedDream).toBeNull()
        // Send data with title and no description
        const response = await request(server).post(url).send({
            dream: {title: 'Flying dream'}
        }).set(...userOneAuth).expect(201)
        // Only title should be present in response
        const dream = response.body.dream
        expect(dream.title).toBe('Flying dream')      
        expect(dream).not.toHaveProperty('description')
        expect(response.body).not.toHaveProperty('themes') 
        // Assert that the dream was added to the database
        savedDream = await Dream.findOne({title:'Flying dream'})
        expect(savedDream).not.toBeNull() 
        // Asser that the themes were added to the database and associated with the correct dream
        assertThemesInDB(defaultThemes, response.body.dream._id.toString())       
    })
})