import request from 'supertest';
import { beforeEach, describe, expect, test } from 'vitest';
import { wipeDBAndSaveData } from '../setup/setupData.js'
import { server } from '../setup/testServer.js'
import { userOneAuth, userThreeAuth } from '../users/data.js';
import { oldDreamId } from './data.js';
import { Theme } from '../../models/theme.model.js';
import { Dream } from '../../models/dream.model.js';
import { baseUrl } from './utils.js';

// Wipe db and save data
beforeEach(async () => {
    await wipeDBAndSaveData()
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