import request from 'supertest';
import { server } from '../setup/testServer.js';
import { beforeEach, describe, expect, test } from 'vitest';
import { User } from '../../models/user.model.js';
import { userOneCreds, baseUrl } from './data.js';
import { userType, createUser } from './utils/userCreation.js';
import { wipeDB } from '../setup/wipeDB.js';
import { Dream } from '../../models/dream.model.js';
import { DreamDocument, DreamInterface } from '../../interfaces/dream.interfaces.js';
import { guestData } from '../../seed-data/guestSeedData.js';
import { titleToDream } from './utils/titleToDream.js';
import { Types } from 'mongoose';
import { Theme } from '../../models/theme.model.js';

let userOne: userType
let guestUser : userType
let newGuestDreamId: Types.ObjectId
let newGuestThemeId: Types.ObjectId
const guestUserCreds = {email: 'demo-test@email.com', password: 'demotest123'}

// Wipe db and save data
beforeEach(async () => {
    await wipeDB()
    userOne = await createUser({...userOneCreds, withTokens: false})
    guestUser = await createUser({...guestUserCreds, isGuest: true})

    // Save a dream and theme with owner guestUser to test that data is reset on new login
    const dream = await new Dream({
        title: 'New guest dream',
        owner: guestUser._id
    }).save()
    newGuestDreamId = dream._id

    const theme = await new Theme({
        theme: 'New guest theme',
        dream: newGuestDreamId,
        owner: guestUser._id
    }).save()
    newGuestThemeId = theme._id
})

const guestTitles = guestData.map(d => d.dream.title)

// Define url
const loginUrl = baseUrl + '/login'

describe('LOGIN/LOGOUT SUCCESS', () => {
    test('Login to non guest account should be successful with correct credentials, and logout should succeed using generated token.', async () => {
        // Extract user id
        const id = userOne._id.toString()
        // Assert that only no tokens currently exist in database
        let user = await User.findByIdOrThrowError(id)
        expect(user.tokens).toHaveLength(0)
        // Send correct data
        const response = await request(server).post(loginUrl).send(userOne).expect(200)
        // User object and token should be returned
        expect(response.body.user).toMatchObject({email:userOne.email, _id: id})
        const token = response.body.token
        expect(token).not.toBeNull()
        expect(response.body).not.toHaveProperty('password')
        // Assert not guest account
        expect(response.body.isGuest).toBe(false)
        // Assert token was added to User in database
        user = await User.findByIdOrThrowError(id)
        expect(user.tokens).toHaveLength(1)
        // Logout
        await request(server).post(`${baseUrl}/logout`).set('Authorization', `Bearer ${token}`).expect(200)
        // Assert database has changed - Token should have been removed
        user = await User.findByIdOrThrowError(id)
        expect(user.tokens).toHaveLength(0)        
    })

    test('Login to guest account should be successful and seed data should be reset.', async () => {
        // Assert that new guest dream and theme are currently saved in db
        const newDream = Dream.findById(newGuestDreamId)
        const newTheme = Theme.findById(newGuestThemeId)
        expect(newDream).not.toBeNull()
        expect(newTheme).not.toBeNull()
        // Login as guest
        const response = await request(server).post(baseUrl + '/login-guest').send({}).expect(200)
        expect(response.body.isGuest).toBe(true)

        // Correct seed dream and theme data is created
        const guestsDreams: DreamInterface[] = await Dream.find({owner: guestUser._id})
        expect(guestsDreams).toHaveLength(4)
        await Promise.all(
            guestTitles.map(async (title) => {
                const dream = await Dream.findOne({title}) as DreamDocument
                const dreamData = titleToDream(title)
                const {description, notes, date} = dream
                expect({description, notes, date, title}).toMatchObject(dreamData.dream)
                expect(dream.owner.toString()).toBe(guestUser._id.toString())
                // Themes associated with dream should be correct
                const themes = await Theme.find({dream: dream._id})
                const themeNames = themes.map(t => t.theme)
                expect(themeNames.sort()).toEqual(dreamData.themes.sort())
            })
        )

        // New dream and theme should have been deleted
        const nullDream = await Dream.findById(newGuestDreamId)
        const nullTheme = await Dream.findById(newGuestThemeId)
        expect(nullDream).toBeNull()
        expect(nullTheme).toBeNull()
    })
})