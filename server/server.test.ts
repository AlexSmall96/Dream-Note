import request from 'supertest';
import { server } from './test-utils/setupTests.js'
import { expect, test } from 'vitest';

// Test API welcome message
test('Welcome message should be returned.', async () => {
    const response = await request(server).get('/api').expect(200)
    expect(response.body.message).toBe('Welcome to The Dream Note API.')
})