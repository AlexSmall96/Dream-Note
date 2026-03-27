import { NextFunction, Response } from 'express';
import { IncomingAuthRequest} from "../../interfaces/auth.interfaces.js"
import { AppError } from '../../utils/appError.js';

export function limitNumberOfThemes(req:IncomingAuthRequest, _res: Response, next: NextFunction) {
    const LIMIT = 6
    const themes = req.body.themes
    if (themes && themes.length > LIMIT) {
        throw new AppError(`A dream can only have up to ${LIMIT} themes.`, 400)
    }
    next()
}
