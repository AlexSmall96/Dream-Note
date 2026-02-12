export type user = {
    id: string,
    email: string
}

export type userError = {
    errors: {value: string, param: string, msg: string}[]
}

export type authInput = {
    email: string,
    password: string
}

export type logoutSuccess = {message: string }
