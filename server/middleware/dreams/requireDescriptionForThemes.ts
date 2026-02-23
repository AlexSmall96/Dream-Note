import { NextFunction, Response, Request } from 'express';
import { AppError } from '../../utils/appError';

export const requireDescriptionForThemes = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    const description = req.body.dream.description
    const themes = req.body.themes

    if (themes.length > 0 && !description) {
        throw new AppError('Cannot add themes to dream with no description.', 400, 'description')
    }

  next()
}