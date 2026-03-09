export type passwordUpdateInput = {
    currPassword?: string,
    password?: string
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