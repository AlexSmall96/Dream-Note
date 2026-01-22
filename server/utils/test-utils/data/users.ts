import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { User } from '../../../models/user.model.js';

// Create user ids 
const userOneId = new mongoose.Types.ObjectId()
const userThreeId = new mongoose.Types.ObjectId()
const userFourId = new mongoose.Types.ObjectId()

// Create token
const JWT_SECRET = process.env.JWT_SECRET

const generateToken = (id: string) => {
    if (!JWT_SECRET){
        throw new Error('Please provide a json web token secret key.')
    }
    return jwt.sign({ _id:id }, JWT_SECRET, { expiresIn: "24h" })
}

// Create users to save to DB
const userOne = {
    email: 'user1@email.com',
    password: 'apple123',
    _id: userOneId,
    tokens: [generateToken(userOneId.toString())]
}

const userThree = {
    email: 'user3@email.com',
    password: 'orange123',
    _id: userThreeId,
    tokens: [generateToken(userThreeId.toString())]
}

const userFour = {
    email: 'user4@email.com',
    password: 'pear123',
    _id: userFourId,
    tokens: [generateToken(userFourId.toString())]
}

// Use token to create auth string
const userOneAuth: [string, string] = ['Authorization', `Bearer ${userOne.tokens[0]}`]
const userThreeAuth: [string, string] = ['Authorization', `Bearer ${userThree.tokens[0]}`]
const userFourAuth: [string, string] = ['Authorization', `Bearer ${userFour.tokens[0]}`]

const saveUsers = async () => {
    await new User(userOne).save()
    await new User(userThree).save()
    await new User(userFour).save()
}

export {
    userOneId, userThreeId, userFourId, saveUsers, userOne, userOneAuth, userThreeAuth, userFourAuth
}

