import { Request, Response, NextFunction } from "express"
import { AppError } from '../utils/appError.js'

export const errorHandler = (
	err: any,
	_req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		// Custom AppError
		if (err instanceof AppError) {
			return res.status(err.statusCode).json({
				errors: err.errors
			})
		}

		return res.status(500).json({
			errors: [{ msg: "Something went wrong." }]
		})
	} catch (err){
		next(err)
	}
	
}