import { User } from '../models/user.model.js'
import { RequestWithUser } from "../interfaces/auth.interfaces.js"
import { NextFunction, Response } from "express"
import bcrypt from "bcrypt";
import { AppError } from '../utils/appError.js';

// Middleware to find a user by email address and password
// Used in login router
export const findByCredentials = async (req:RequestWithUser, res: Response, next: NextFunction) => {
    // Destructure email and password
    const { email, password } = req.body
    try {
        // Check if user exists with email address
        const user = await User.findOne({email})
        if (!user){
            throw new AppError('No account found associated with provided email address.', 400, 'email')
        }
        // Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch){
            throw new AppError('Incorrect password.', 400, 'password')
        }
        // If both checks pass, add found user to request 
        req.user = user
        // Call next to get back to login router
        next()
    } catch (err){
        next(err)
    }
}