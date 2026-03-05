import dotenv from 'dotenv';
dotenv.config({ path: './test.env' });
import { afterAll, beforeAll } from 'vitest'
import mongoose from 'mongoose'
import { connectToDB } from '../server/utils/connectToDB.js'

beforeAll(async () => {
    await connectToDB(true)
})


afterAll(async () => {
    if (mongoose?.connection?.readyState !== 0) {
        await mongoose.disconnect()
    }
})
