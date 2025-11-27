import { User } from '../models/user.model.js'
import { AuthenticatedRequest } from "../interfaces/auth.interfaces.js"
import { NextFunction, Response } from "express"
import bcrypt from "bcrypt";

// Middleware to find a user by email address and password
// Used in login router
export const findByCredentials = async (req:AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Destructure email and password
    const { email, password } = req.body
    try {
        // Check if user exists with email address
        const user = await User.findOne({email})
        if (!user){
            return res.status(400).json({errors: [{param: 'email', message: 'No account found associated with provided email address.'}]})
        }
        // Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch){
            return res.status(400).json({errors: [{param: 'password', message: 'Incorrect password.'}]})
        }
        // If both checks pass, add found user to request 
        req.user = user
        // Call next to get back to login router
        next()
    } catch (err){
        next(err)
    }
}