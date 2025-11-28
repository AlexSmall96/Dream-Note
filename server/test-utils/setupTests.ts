// Creates a test server with no client rendering. Only routes and DB connection
import { server, bootstrap } from '../server.js'
import { addRoutes } from '../config/routes.config.js';
import { User } from '../models/user.model.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET

// Add all routes to server
addRoutes(server)

// Call boostrap function to connect to database
bootstrap();

// Define and save test data
const userOneId = new mongoose.Types.ObjectId()

const generateToken = () => {
    if (!JWT_SECRET){
        throw new Error('Please provide a json web token secret key.')
    }
    return jwt.sign({ _id:userOneId.toString() }, JWT_SECRET, { expiresIn: "24h" })
}

const token = generateToken()

const userOne = {
    email: 'user1@email.com',
    password: 'apple123',
    _id: userOneId,
    tokens: [token]
}

const userOneAuth: [string, string] = ['Authorization', `Bearer ${userOne.tokens[0]}`]

const wipeDBAndSaveData = async () => {
    await User.deleteMany()
    await new User(userOne).save()
}

export { server, wipeDBAndSaveData, userOne, userOneId, userOneAuth }