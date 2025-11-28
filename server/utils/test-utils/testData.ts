import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { User } from '../../models/user.model';

// Define and save test data

// Create user id 
const userOneId = new mongoose.Types.ObjectId()

// Create token
const JWT_SECRET = process.env.JWT_SECRET

const generateToken = () => {
    if (!JWT_SECRET){
        throw new Error('Please provide a json web token secret key.')
    }
    return jwt.sign({ _id:userOneId.toString() }, JWT_SECRET, { expiresIn: "24h" })
}

const token = generateToken()

// Create 1 user to save to DB
const userOne = {
    email: 'user1@email.com',
    password: 'apple123',
    _id: userOneId,
    tokens: [token]
}

// Use token to create auth string
const userOneAuth: [string, string] = ['Authorization', `Bearer ${userOne.tokens[0]}`]

// Wipe DB, save data
const wipeDBAndSaveData = async () => {
    await User.deleteMany()
    await new User(userOne).save()
}

export { wipeDBAndSaveData, userOne, userOneId, userOneAuth }