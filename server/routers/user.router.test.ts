import request from 'supertest';
import { server, wipeDBAndSaveData } from '../test-utils/setupTests.js'
import { beforeEach, describe, expect, test } from 'vitest';
import { User } from '../models/user.model.js';


beforeEach(async () => wipeDBAndSaveData())

const url = '/api/users'

describe('Signup', () => {
    test('Signup should fail with taken email address or password too short.', async () => {
        // Post should fail
        const response = await request(server).post(`${url}/signup`).send({
            email: 'user1@email.com',
            password: 'apple'
        }).expect(400)
        // Email error message and password error message should be returned
        const errorsArray = response.body.errors
        expect(errorsArray).toHaveLength(2)
        expect(errorsArray[0].param).toBe('email')
        expect(errorsArray[1].param).toBe('password')
        expect(errorsArray[0].msg).toBe('Email address already in use.')
        expect(errorsArray[1].msg).toBe('Password must be at least 8 characters.')
    })
    test('Signup should fail with invalid email address or password containing "password".', async () => {
        const response = await request(server).post(`${url}/signup`).send({
            email: 'user1',
            password: 'password'
        }).expect(400) 
        // Email error message and password error message should be returned
        const errorsArray = response.body.errors
        expect(errorsArray).toHaveLength(2)
        expect(errorsArray[0].param).toBe('email')
        expect(errorsArray[1].param).toBe('password')
        expect(errorsArray[0].msg).toBe('Please provide a valid email address.')
        expect(errorsArray[1].msg).toBe('Password cannot contain "password"')       
    })
    test('Signup should succeed with valid data.', async() => {
        // Post correct data
        const response = await request(server).post(`${url}/signup`).send({
            email: 'user2@email.com',
            password: 'apple123'
        }).expect(201)
        // Response contains correct details - contains email and not password or token
        expect(response.body).toMatchObject({email: 'user2@email.com'})
        // Assert the database was changed
        const user = await User.findOne({email: 'user2@email.com'})
        expect(user).not.toBeNull()
    })
})