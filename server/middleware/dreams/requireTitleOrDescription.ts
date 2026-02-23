import { NextFunction, Response, Request } from 'express';
import { AppError } from '../../utils/appError';

export const requireTitleOrDescription = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    const { title, description } = req.body.dream

    if (!title && !description) {
        throw new AppError('At least one of title or description is required.')
    }

  next()
}