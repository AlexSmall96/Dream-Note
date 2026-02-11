import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { User } from '../../../models/user.model.js';
import  { Types } from 'mongoose';

// Generate a web token dynamically
const JWT_SECRET = process.env.JWT_SECRET
const generateToken = (_id: string, isGuest: boolean = false) => {
    if (!JWT_SECRET){
        throw new Error('Please provide a json web token secret key.')
    }
    return jwt.sign({ _id, isGuest }, JWT_SECRET, { expiresIn: "24h" })
}

type userType = {
    email: string,
    password: string,
    _id: Types.ObjectId,
    tokens: string[],
}

// Dynamically create a user by generating token and id
const createUser = async ({email, password, isGuest = false, withTokens = true}:{email: string, password: string, isGuest?: boolean, withTokens?: boolean}): Promise<userType> => {
    
    // Create a fresh token and id each time for test reliability
    const _id = new mongoose.Types.ObjectId()
    const token = generateToken(_id.toString(), isGuest)
    
    const user = {
        _id, email, password, tokens: withTokens ? [token] : []
    }

    await new User(user).save()

    return user
}

// Creates ready to use format from token for sending authenticated requests
const getAuthHeader = (token: string): [string, string] => {
    return ['Authorization', `Bearer ${token}`]
} 

export {
    createUser, getAuthHeader, userType
}