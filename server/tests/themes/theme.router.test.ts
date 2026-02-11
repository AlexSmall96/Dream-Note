import request from 'supertest';
import { server } from '../setup/testServer.js'
import { beforeEach, describe, expect, test } from 'vitest';
import { DreamInterface } from '../../interfaces/dream.interfaces.js';
import { Theme } from '../../models/theme.model.js';
import { createUser, userThreeCreds, userFourCreds, getAuthHeader } from '../users/data.js'
import { oldDreamData, newDreamData, dreamWithManyThemesData } from '../dreams/data.js';
import { wipeDB } from '../setup/wipeDB.js'
import { Types } from 'mongoose';
import { Dream } from '../../models/dream.model.js';
 
type dreamType = {
    title: string,
    description: string,
    date: Date,
    owner: Types.ObjectId,
    _id: Types.ObjectId
}

let userThreeAuth: [string, string]
let userFourAuth: [string, string]
let oldDream: dreamType
let newDream: dreamType
let oldDreamTheme1Id : Types.ObjectId

// Wipe db and save data
beforeEach(async () => {
    wipeDB()

    // Create two users to test get all dreams and pagination & sorting
    const userThree = await createUser(userThreeCreds)
    userThreeAuth = getAuthHeader(userThree.tokens[0])
    const userFour = await createUser(userFourCreds)
    userFourAuth = getAuthHeader(userFour.tokens[0])

    // Create two dreams owned by userThree
    oldDream = await new Dream({...oldDreamData, owner: userThree._id}).save()
    newDream = await new Dream({...newDreamData, owner: userThree._id}).save()

    // Create two themes to associate with each dream
    const oldDreamTheme1 = await new Theme({theme: 'Lateness', dream: oldDream._id}).save()
    oldDreamTheme1Id = oldDreamTheme1._id
    await new Theme({theme: 'Anxiety', dream: oldDream._id}).save()
    await new Theme({theme: 'Fear', dream: newDream._id}).save()
    await new Theme({theme: 'Animals', dream: newDream._id}).save()

    // Create a dream owned by userFour and associated themes to test sorting and pagination
    const dreamWithManyThemes = await new Dream({...dreamWithManyThemesData, owner: userFour._id}).save()
    const manyThemeTitles: string[] = []
    for (let i=0; i<10; i++){
        manyThemeTitles.push(i < 5? `b-theme-${i}` : i < 8 ? `a-theme-${i}` : `c-theme-${i}`)
    }
    await Promise.all(
        manyThemeTitles.map(async (theme, i) => {
            await new Theme({
                theme,
                dream: dreamWithManyThemes._id,
            }).save()
        })
    )
    
})

// Define base url for theme router
const baseUrl = '/api/themes'

describe('GET ALL USERS THEMES', () => {

    // Define url
    const url = baseUrl

    test('Get themes should return all current users themes, each with associated dream id, title and date.', async () => {
        // Get all themes associated with userThree's dreams
        const response = await request(server).get(url).set(...userThreeAuth).expect(200)
        const themes = response.body.themes
        // Should be 4 in total
        expect(themes).toHaveLength(4)
        // Default order is newest -> oldest
        const themeNames = ['Animals', 'Fear', 'Anxiety', 'Lateness']
        // Check themes are in correct order and dream data is correct
        themes.map((theme: {theme: string, dream: DreamInterface}, index: number) => {
            const themeName = theme.theme
            expect(themeName).toBe(themeNames[index])
            const dream = theme.dream
            expect(dream.title).toBe(index < 2? newDream.title : oldDream.title)
            expect(new Date(dream.date)).toEqual(index < 2? new Date(newDream.date): new Date(oldDream.date))
        })
    })

    test('Pagination and sorting should return correct themes.', async () => {
        // Get themes assocaited with userFour's dreams
        // Set limit to 5, skip 0, and sort by theme (A-Z)
        const responsePageOne = await request(server).get(`${url}/?limit=5&sort=theme`).set(...userFourAuth).expect(200)
        const themesPageOne = responsePageOne.body.themes  
        expect(themesPageOne).toHaveLength(5)
        // First should be a-theme-5, last should be b-theme-1
        expect(themesPageOne[0].theme).toBe('a-theme-5')    
        expect(themesPageOne[4].theme).toBe('b-theme-1')
        // Each theme should be associated with correct dream
        themesPageOne.map((theme: {theme: string, dream: DreamInterface}) => {
            expect(theme.dream.title).toBe('A dream with many themes')
        })   
        // Set limit to 5, skip 5, and sort by theme (A-Z)
        const responsePageTwo = await request(server).get(`${url}/?limit=5&skip=5&sort=theme`).set(...userFourAuth).expect(200)
        const themesPageTwo = responsePageTwo.body.themes
        expect(themesPageTwo).toHaveLength(5)
        // First should be b-theme-2, last should be c-theme-9
        expect(themesPageTwo[0].theme).toBe('b-theme-2')
        expect(themesPageTwo[4].theme).toBe('c-theme-9')
        // Each theme should be associated with correct dream
        themesPageOne.map((theme: {theme: string, dream: DreamInterface}) => {
            expect(theme.dream.title).toBe('A dream with many themes')
        })   
    })
})

describe('REMOVE THEME', () => {
    // Define url
    const url = baseUrl + '/delete'

    test('User cannot delete theme if they are not the owner of the associated dream.', async () => {
        // Attempt to delete a theme associated with oldDream authorized as userFour
        const response = await request(server).delete(`${url}/${oldDreamTheme1Id}`).set(...userFourAuth).expect(401)
        expect(response.body.error).toBe('You are not authorized to delete this theme.')
    })

    test('Theme can be removed if user is owner of associcated dream.', async () => {
        // Delete a theme associated with oldDream authorized as userThree
        await request(server).delete(`${url}/${oldDreamTheme1Id}`).set(...userThreeAuth).expect(200)
        // Assert theme was removed from database
        const nullTheme = await Theme.findById(oldDreamTheme1Id)
        expect(nullTheme).toBeNull()
    })
})