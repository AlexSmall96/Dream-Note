import dotenv from 'dotenv';
dotenv.config({ path: './test.env' });
import { afterAll } from 'vitest'
import mongoose from 'mongoose'

afterAll(async () => {
    if (mongoose?.connection?.readyState !== 0) {
        await mongoose.disconnect()
    }
})
