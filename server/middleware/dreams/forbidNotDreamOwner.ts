import { NextFunction, Response } from 'express';
import { AuthenticatedRequest, IncomingAuthRequest} from "../../interfaces/auth.interfaces.js"
import { AppError } from '../../utils/appError.js';
import { Dream } from '../../models/dream.model.js';

export function forbidNotDreamOwner(message: string) {
    return async function(req:IncomingAuthRequest, _res: Response, next: NextFunction) {
        const dreamId = req.params.dreamId ?? req.params.id
        if (!dreamId) {
            throw new AppError('Dream id not provided.', 400)
        }
        const authReq = req as AuthenticatedRequest
        const owner = authReq.user._id
        try {
            const dream = await Dream.findOne({owner, _id: dreamId})
            if (!dream){
                throw new AppError(message, 403)
            }
            next()             
        } catch (err){
            next(err)
        }
    }
}