import request from 'supertest';
import { beforeEach, describe, expect, test } from 'vitest';
import { wipeDBAndSaveData } from '../setup/setupData.js'
import { oldDream, oldDreamId } from './data.js';
import { server } from '../setup/testServer.js'
import { userOneAuth, userThreeId, userThreeAuth } from '../users/data.js';
import { baseUrl } from './utils.js';

// Wipe db and save data
beforeEach(async () => {
    await wipeDBAndSaveData()
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