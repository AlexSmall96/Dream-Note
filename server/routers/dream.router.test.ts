import request from 'supertest';
import { server } from '../utils/test-utils/testServer.js'
import { beforeEach, describe, expect, test, vi} from 'vitest';
import { Dream } from '../models/dream.model.js';
import { Theme } from '../models/theme.model.js';
import { DreamDocument } from '../interfaces/dream.interfaces.js';
import { 
    wipeDBAndSaveData, 
    userOneId, 
    userOneAuth, 
    userThreeAuth, 
    oldDreamId, 
    oldDream, 
    userThreeId,
    dreamWithNoDescId
 } from '../utils/test-utils/testData.js'

// Wipe db and save data
beforeEach(async () => wipeDBAndSaveData())

// Define base url for dream router
const baseUrl = '/api/dreams'

// Helper function to assert an array of themes have been added to the db
// Checks they are associated with the correct dream
const assertThemesInDB = async (themes: string[], dreamId: string) => {
    await Promise.all(
        themes.map(async (theme) => {
            const savedTheme = await Theme.findByThemeOrThrowError(theme)
            expect(savedTheme).not.toBeNull()
            expect(savedTheme.dream.toString()).toBe(dreamId)
        })          
    )
}

// Helper function to assert users dreams are in correct order and correct number are returned
// Based on dreams saved in '../utils/test-utils/testData.js'
const assertDreamTitlesAndDates = async (dreams: DreamDocument[], length: number, start: number = 9) => {
    expect(dreams).toHaveLength(length)
    dreams.map((dream: DreamDocument, index: number) => {
        expect(dream.title).toBe(`dream${start-index}`)
        expect(dream.date).toBe(`2025-06-0${start-index}T00:00:00.000Z`)
    })    
}

// Define default themes sent back from dev version of openAI API
const defaultThemes = ['theme1', 'theme2', 'theme3']

// Tests 

// Log dream
describe('LOG NEW DREAM', () => {
    // Define url
    const url = baseUrl + '/log'

    test('Logging new dream should fail if title and description are missing.', async () => {
        // Send incomplete data
        const response = await request(server).post(url).send({dream: {}}).set(...userOneAuth).expect(400)
        // Correct error message is returned
        expect(response.body.error).toBe('At least one of title or description is required.')
    })

    test.only('Logging new dream should succeed if description is provided, with title and themes generated from dev version of openAI API.', async () => {
        // Assert that no dreams with the correct title are found in DB
        let savedDream = await Dream.findOne({title:'I had a dream I was flying. It...'})
        expect(savedDream).toBeNull()
        // Assert that no themes with the default names are found in DB yet
        const themes = await Theme.find({$or: [{theme: 'theme1'}, {theme: 'theme2'}, {theme: 'theme3'}]})
        expect(themes).toHaveLength(0)
        // Send data with description and no title
        const description = 'I had a dream I was flying. It was very exciting.'
        const response = await request(server).post(url).send({
            dream: { description }, themes: []
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
        await assertThemesInDB(defaultThemes, response.body.dream._id.toString())
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
        await assertThemesInDB(themes, response.body.dream._id.toString())       
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
    })
})

// Get dreams
describe('GET ALL DREAMS', () => {
    // Define url
    const url = baseUrl
    
    test("All user's dreams should be returned when no parameters are passed in.", async () => {
        // Get all userOne's dreams
        const response = await request(server).get(url).set(...userOneAuth).expect(200)
        // Should be 9 dreams, sorted oldest to newest
        const dreams = response.body.dreams
        assertDreamTitlesAndDates(dreams, 9)
    })

    test("Skip, limit and title parameters return correct dreams.", async () => {
        // Get dream page one of dreams
        const pageOneResponse = await request(server).get(`${url}?limit=5&skip=0`).set(...userOneAuth).expect(200)
        // Should be 5 dreams, sorted oldest to newest
        const pageOneDreams = pageOneResponse.body.dreams
        assertDreamTitlesAndDates(pageOneDreams, 5)
        // Get dream page two of dreams
        const pageTwoResponse = await request(server).get(`${url}?limit=5&skip=5`).set(...userOneAuth).expect(200)
        // Should be 4 dreams, starting at dream4, sorted oldest to newest
        const pageTwoDreams = pageTwoResponse.body.dreams
        assertDreamTitlesAndDates(pageTwoDreams, 4, 4)
        // Should only return dream9
        const singleResponse = await request(server).get(`${url}?limit=5&skip=0&title=dream9`).set(...userOneAuth).expect(200)
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

    test('Filtering by days ago returns correct dreams.', async () => {
        // Set days ago to 400
        const allDreamsResponse = await request(server).get(`${url}?daysAgo=400`).set(...userThreeAuth).expect(200)
        const allDreams = allDreamsResponse.body.dreams
        // All dreams should be returned
        expect(allDreams).toHaveLength(5)
        // Last two should be oldest
        expect(allDreams[3].title).toBe('A dream from 6 months ago')
        expect(allDreams[4].title).toBe('A dream from 1 year ago')
        // set days ago to 250
        const newResponse = await request(server).get(`${url}?daysAgo=250`).set(...userThreeAuth).expect(200)
        // Only 4 dreams should be returned
        const newDreams = newResponse.body.dreams
        expect(newDreams).toHaveLength(4)
        // Last dream should be oldest
        expect(allDreams[3].title).toBe('A dream from 6 months ago')
        // Searching for A dream from 1 year ago with days ago set to 250 returns empty array
        const emptyResponse = await request(server).get(`${url}?daysAgo=250&title=A dream from 1 year ago`).set(...userThreeAuth).expect(200)
        expect(emptyResponse.body.dreams).toHaveLength(0)
    })
})

// View a dream
describe('VIEW DREAM DETAILS', () => {
    // Define url
    const url = baseUrl + '/view'

    test('View dream should succeed with valid id if user is owner of dream.', async () => {
        // View one of userThree's dreams
        const response = await request(server).get(`${url}/${oldDreamId}`).set(...userThreeAuth).expect(200)
        const { dream, themes } = response.body
        const { title, description, date, owner } = dream
        // Assert that dream response matches test data
        expect(title).toBe(oldDream.title)
        expect(description).toBe(oldDream.description)
        expect(date).toBe(oldDream.date)
        expect(owner).toBe(userThreeId.toString())
        // Assert themes are correct - should be 2 in total
        expect(themes).toHaveLength(2)
        // Should be sorted alphabetically
        expect(themes[0].theme).toBe('Anxiety')
        expect(themes[1].theme).toBe('Lateness')
        // Both themes should have oldDreamId as dream
        expect(themes[0].dream).toBe(oldDreamId.toString())
        expect(themes[1].dream).toBe(oldDreamId.toString())
    })

    test('View dream should fail if user is not owner of dream.', async () => {
        // View one of userThree's dreams, authorized as userOne
        const response = await request(server).get(`${url}/${oldDreamId}`).set(...userOneAuth).expect(401)
        // Error message should be returned
        expect(response.body.error).toBe('You are not authorized to view this dream.')
    })
})

// Update dream
describe('UPDATE DREAM', () => {
    // Define url
    const url = baseUrl + '/update'

    test('Update dream fails if request body does not contain "dream" as a field.', async () => {
        const response = await request(server).patch(`${url}/${oldDreamId}`).send({
            title: 'Dream title'
        }).set(...userThreeAuth).expect(400)
        expect(response.body.error).toBe("Request body must contain the field 'dream'.")
    })

    // User cannot update another users dream
    test('Update dream should fail if user is not owner of dream.', async () => {
        const response = await request(server).patch(`${url}/${oldDreamId}`).send({
            dream: {title: 'Dream title'}
        }).set(...userOneAuth).expect(401)
        expect(response.body.error).toBe('You are not authorized to edit this dream.')
    })

    test('Update dream should fail if title is null.', async () => {
        const response = await request(server).patch(`${url}/${oldDreamId}`).send({
            dream: {title: null, description: null, date: '2024-11-30T00:00:00.000Z'}
        }).set(...userThreeAuth).expect(400)
        expect(response.body.error).toBe("Dream data must contain title.")        
    })

    test('Update dream succeeds with valid data, all fields can be changed and themes added.', async () => {
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
        const themeNames = ['Lateness', 'Anxiety', 'Travel']
        themes.map((theme:{theme:string}, index: number) => {
            expect(theme.theme).toBe(themeNames[index])
        })
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

    test('If description is removed, themes should also be removed.', async () => {
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
        console.log(dream)
        // No themes should be associated with the dream
        themes = await Theme.find({dream: oldDreamId})
        expect(themes).toHaveLength(0)
    })

    test('Dream with no description can have other fields updated, and themes are not generated.', async () => {
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


// Delete dream
describe('DELETE DREAM', () => {

    // Define url
    const url = baseUrl + '/delete'

    test('User cannot delete dream they are not the owner of.', async () => {
        // Attempt unauthorized deletion
        const response = await request(server).delete(`${url}/${oldDreamId}`).set(...userOneAuth).expect(401)
        expect(response.body.error).toBe('You are not authorized to delete this dream.')        
    })

    test('Dream deletion is successful if user is owner of dream, and associated themes are also deleted.', async () => {
        // The 2 themes associated with dream: oldDreamId should be in db
        const themeNames = ['Lateness', 'Anxiety']
        await Promise.all(themeNames.map(async (theme: string) => {
            const savedTheme = await Theme.find({theme, dream: oldDreamId})
            expect(savedTheme).not.toBeNull()
        }))
        // Delete dream authorized as correct owner
        await request(server).delete(`${url}/${oldDreamId}`).set(...userThreeAuth).expect(200)
        // Dream should be removed from database
        const dream = await Dream.findById(oldDreamId)
        expect(dream).toBeNull()
        // Associated themes should be removed
        await Promise.all(themeNames.map(async (theme: string) => {
            const nullTheme = await Theme.findOne({theme})
            expect(nullTheme).toBeNull()
        }))
    })
})