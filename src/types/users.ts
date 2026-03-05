export type user = {
    id: string,
    email: string,
    isVerified: boolean
}

export type currentUser = {
    user: user,
    isGuest: boolean
}

export type userError = {
    errors: {value: string, param: string, msg: string}[]
}

export type authInput = {
    email: string,
    password: string
}

export type logoutSuccess = {message: string }
