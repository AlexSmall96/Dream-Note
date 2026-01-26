import request from 'supertest';
import { wipeDBAndSaveData } from '../setup/setupData.js'
import { server } from '../setup/testServer.js';
import { beforeEach, describe, expect, test } from 'vitest';
import { Theme } from '../../models/theme.model.js';
import { Dream } from '../../models/dream.model.js';
import { baseUrl, assertErrors } from './utils.js';
import { userThreeAuth, userThreeId } from './data.js';

// Wipe db and save data
beforeEach(async () => wipeDBAndSaveData())

// Delete account
describe('DELETE', () => {
    // Define url
    const url = baseUrl + '/delete' 

    test('Account deletion should fail when not authenticated.', async () => {
        // Send unauthenticated response
        const response = await request(server).delete(url).expect(401)
        // Assert correct error is returned
        assertErrors(response.body.errors, [{param: 'token', msg: 'Please provide json web token to authenticate.'}])        
    })  

    test('Account deletion should be successful when authenticated.', async () => {
        // The 4 themes associated with userThree's dreams should be in db
        const themeNames = ['Lateness', 'Anxiety', 'Fear', 'Animals']
        await Promise.all(themeNames.map(async (theme: string) => {
            const savedTheme = await Theme.findOne({theme})
            expect(savedTheme).not.toBeNull()
        }))
        // Send authenticated response
        await request(server).delete(url).set(...userThreeAuth).expect(200)
        // Users dreams should be deleted, along with any themes associated with them
        const dreams = await Dream.find({owner: userThreeId})
        expect(dreams).toHaveLength(0)
        // Assert themes are no longer in the database
        await Promise.all(themeNames.map(async (theme: string) => {
            const nullTheme = await Theme.findOne({theme})
            expect(nullTheme).toBeNull()
        }))
    })
})