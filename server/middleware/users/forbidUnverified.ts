import { NextFunction, Response } from 'express';
import { AuthenticatedRequest, IncomingAuthRequest} from "../../interfaces/auth.interfaces.js"
import { AppError } from '../../utils/appError.js';

export function forbidUnverified(message: string) {
    return function(req:IncomingAuthRequest, res: Response, next: NextFunction) {
        const authReq = req as AuthenticatedRequest
        const isVerified = authReq.user.isVerified
        try {
            // Should always be used after auth middleware
            if (!isVerified) {
                throw new AppError(message, 403)
            }
            next()             
        } catch (err){
            next(err)
        }
    }
}