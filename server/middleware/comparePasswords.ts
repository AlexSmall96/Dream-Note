import { User } from '../models/user.model.js'
import { IncomingAuthRequest } from "../interfaces/auth.interfaces.js"
import { NextFunction, Response } from "express"
import bcrypt from "bcrypt";
import { AppError } from '../utils/appError.js';

export const comparePasswords = async (req:IncomingAuthRequest, _res: Response, next: NextFunction) => {
    try {
        const currPassword = req.body.currPassword
        const email = req.user.email

        const user = await User.findByEmailOrThrowError(email)
        const isMatch: boolean = await bcrypt.compare(currPassword, user.password)
        
        if (!isMatch){
            throw new AppError('Current password is incorrect.', 400, 'currPassword')
        }
        next()
    } catch (err){
        next(err)
    }
}