import request from 'supertest';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { Theme } from '../../../models/theme.model.js';
import { Dream } from '../../../models/dream.model.js';
import { assertSingleError } from '../utils/assertErrors.js'
import { getAuthHeader, createUser } from '../utils/userCreation.js';
import { userThreeCreds, guestUserCreds, userOneCreds, accountUrl } from '../data.js';
import { oldDreamData } from '../../dreams/data.js';
import { Types } from 'mongoose';
import { wipeDB } from '../../setup/wipeDB.js';
import nodemailer from 'nodemailer';

let userThreeAuth: [string, string]
let guestAuth: [string, string]
let userThreeId : Types.ObjectId
let dreamId : Types.ObjectId
let userOneAuth: [string, string]

// Wipe db and save data
beforeEach(async () => {
    await wipeDB()

    // Create a user to be owner of dreams
    const userThree = await createUser(userThreeCreds)
    userThreeId = userThree._id
    userThreeAuth = getAuthHeader(userThree.tokens[0])

    // Create dreams and themes with saved user to test casade deletion
    const oldDream = await new Dream({...oldDreamData, owner: userThree._id}).save()
    dreamId = oldDream._id
    await new Theme({theme: 'Adventure', dream: oldDream._id, owner: userThree._id}).save()
    await new Theme({theme: 'Freedom', dream: oldDream._id, owner: userThree._id}).save()

    // Create guest user to test that deletion is forbidden in guest account
    const guest = await createUser({...guestUserCreds, isGuest: true})
    guestAuth = getAuthHeader(guest.tokens[0])

    // Create an unverified user to test deletion is forbidden
    const userOne = await createUser({...userOneCreds, isVerified: false})
    userOneAuth = getAuthHeader(userOne.tokens[0])
}) 

// Mock nodemailer with vi 
vi.mock("nodemailer", () => {
    // Mock sendMail function which is called by emailService
    const sendMail = vi.fn().mockResolvedValue(true);
    return {
        default: {
            createTransport: vi.fn(() => ({sendMail}))
        }
    }
})

import { server } from '../../setup/testServer.js';

const url = accountUrl + '/delete' 

// Tests

describe('Account deletion should fail if:', () => {

    test('User is not authenticated.', async () => {
        // Send unauthenticated response
        const response = await request(server).delete(url).expect(401)
        assertSingleError(response.body.errors, 'Please provide json web token to authenticate.', 'token')
    }) 
    
    test('User is signed in as guest.', async () => {
        // Send response authenticated as guest
        const response = await request(server).delete(url).set(...guestAuth).expect(403)
        assertSingleError(response.body.errors, 'Guest users are not authorized to delete account.')
    })

    test("User's email address is not verified.", async () => {
        // Send response as unverified user
        const response = await request(server).delete(url).set(...userOneAuth).expect(403)
        assertSingleError(response.body.errors, 'Please verify your email address to delete your account.')
    })

    test('User does not provide password.', async () => {
        // Send response with missing password
        const response = await request(server).delete(url).set(...userThreeAuth).expect(400)
        assertSingleError(response.body.errors, 'Please provide your password to delete your account.', 'currPassword')
    })
})

describe('Account deletion should be successful if:', () => {

    test('User is authenticated. Associated dreams and themes should be deleted, and confirmation email should be sent.', async () => {
        // First prove that only 1 dream exists for userThree
        const dreams = await Dream.find({owner: userThreeId})
        expect(dreams).toHaveLength(1)
        const dream = dreams[0]
        expect([dream.title, dream.description]).toEqual([oldDreamData.title, oldDreamData.description])
        // Prove that only 2 themes exist for userThree's single dream
        const themes = await Theme.find({dream: dreamId})
        expect(themes).toHaveLength(2)
        themes.map(t => expect(['Adventure', 'Freedom'].includes(t.theme)))
        // Delete user 3
        const response = await request(server).delete(url).send({currPassword: userThreeCreds.password}).set(...userThreeAuth).expect(200)
        // Assert deletion cascade works: dreams and themes should be gone
        const nullDreams = await Dream.find({owner: userThreeId})
        expect(nullDreams).toHaveLength(0)
        const nullThemes = await Theme.find({dream: dreamId})
        expect(nullThemes).toHaveLength(0)

        const sendMailMock = nodemailer.createTransport().sendMail;
        expect(sendMailMock).toHaveBeenCalledTimes(1);
        expect(sendMailMock).toHaveBeenCalledWith({
            from: process.env.SMTP_MAIL,
            to: userThreeCreds.email,
            subject: 'Your Dream Note account has been deleted.',
            text: 'Your account has been successfully deleted. We are sorry to see you go.'
        })
        
    })
})

