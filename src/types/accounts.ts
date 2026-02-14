export type passwordUpdateInput = {
    currPassword?: string,
    password?: string
}

export type accountError = {
    error: string
}

export type accountErrorArray = {
    errors: {param: string, msg: string, value: string}[]
}

export type accountMessage = {
    message: string
}