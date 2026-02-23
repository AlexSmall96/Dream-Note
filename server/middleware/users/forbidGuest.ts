import { NextFunction, Response } from 'express';
import { IncomingAuthRequest} from "../../interfaces/auth.interfaces.js"
import { AppError } from '../../utils/appError.js';

export function forbidGuest(message: string) {
    return function(req:IncomingAuthRequest, res: Response, next: NextFunction) {
        try {
            // Should always be used after auth middleware
            if (req.isGuest) {
                throw new AppError(message, 403)
            }
            next()             
        } catch (err){
            next(err)
        }
    }
}