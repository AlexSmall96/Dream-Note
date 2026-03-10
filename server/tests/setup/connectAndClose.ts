import { connectToDB } from '../../utils/connectToDB'
import { beforeAll, afterAll } from 'vitest'
import mongoose from 'mongoose'

beforeAll(async () => {
    await connectToDB(true)
})


afterAll(async () => {
    if (mongoose?.connection?.readyState !== 0) {
        await mongoose.disconnect()
    }
})