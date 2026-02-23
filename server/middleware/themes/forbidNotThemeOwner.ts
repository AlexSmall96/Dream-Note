import { NextFunction, Response } from 'express';
import { AuthenticatedRequest, IncomingAuthRequest} from "../../interfaces/auth.interfaces.js"
import { AppError } from '../../utils/appError.js';
import { Theme } from '../../models/theme.model.js';

export async function forbidNotThemeOwner(req:IncomingAuthRequest, _res: Response, next: NextFunction) {
    const themeId = req.params.id
    const authReq = req as AuthenticatedRequest
    const owner = authReq.user._id
    try {
        const theme = await Theme.findOne({_id:themeId, owner})
        if (!theme){
            throw new AppError('You are not authorized to delete this theme.', 403)
        }
        next()             
    } catch (err){
        next(err)
    }
}
