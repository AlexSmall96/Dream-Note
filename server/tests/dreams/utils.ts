import request from 'supertest';
import { expect } from 'vitest';
import { Theme } from '../../models/theme.model';
import { DreamDocument } from '../../interfaces/dream.interfaces';
import { server } from '../setup/testServer.js'

// Define base url for dream router
const baseUrl = '/api/dreams'
const currentYear = new Date().getFullYear()

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
        expect(dream.date).toBe(`${currentYear}-06-0${start-index}T00:00:00.000Z`)
    })
}

// Helper function to filter dreams by month and date and assert correct lengths and titles
const filterAndAssertDreams = async (year: number, month: number, length: number, auth: [string, string], stats?: {[month: string]: number}, titles?: string[] ) => {
    const dreamsResponse = await request(server).get(`${baseUrl}?year=${year}&month=${month}`).set(...auth)
    expect(dreamsResponse.status).toBe(200)
    const dreams = dreamsResponse.body.dreams as DreamDocument[]
    expect(dreams).toHaveLength(length)
    if (titles){
        dreams.map((dream, index) => expect(dream.title).toEqual(titles[index]))
    }
    if (stats){
        expect(dreamsResponse.body.monthlyTotals).toMatchObject(stats)
    } else {
        expect(dreamsResponse.body.monthlyTotals).toMatchObject({})
    }
}

export {
    baseUrl, assertDreamTitlesAndDates, assertThemesInDB, filterAndAssertDreams
}