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

export type resetTokenRes = {
    resetToken: string
}

export type resetPasswordInput = {
    password: string, 
    resetToken: string
}

export type verifyResetOTPInput = {
    otp: string, 
    email: string
}