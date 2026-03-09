export type ErrorResponse = {
    errors: {param: string, msg: string, value: string}[]
}

export type SuccessResponse = {
    message: string
}