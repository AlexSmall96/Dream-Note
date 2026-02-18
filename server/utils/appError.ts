export class AppError extends Error {
    public statusCode: number
    public errors: { param?: string; msg: string }[]

    constructor(
        message: string,
        statusCode = 400,
        param?: string,
    ) {
        super(message)
        this.statusCode = statusCode
        this.errors = [
          param ? { param, msg: message } : { msg: message }
        ]

        Error.captureStackTrace(this, this.constructor)
    }
}