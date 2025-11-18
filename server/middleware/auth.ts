/* 
The code for this file was based on the below article
https://www.xjavascript.com/blog/express-auth-middleware-typescript/
*/
import jwt from 'jsonwebtoken';
import { NextFunction, Response } from 'express';
import { User } from '../models/user.model.js';
import { AuthenticatedRequest, decodedTokenWithId } from "../interfaces/auth.interfaces.js"

// Middleware to verify jwtoken
export const auth = async (req:AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const secretKey = process.env.JWT_SECRET
        if (!secretKey){
            throw new Error('Please provide a json web token secret key.')
        }
        const token = req.headers['authorization']?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).send('Unauthorized');
        }
        const decoded = jwt.verify(token, secretKey) as decodedTokenWithId;
        const user = await User.findOne({_id: decoded._id, tokens: token})
          if (!user) {
            return res.status(401).json({ error: "Invalid token" });
        }
        req.user = user
        req.token = token
        next()
    } catch (e) {
        res.status(401).send({ error: 'Invalid token.' })
    }
}

