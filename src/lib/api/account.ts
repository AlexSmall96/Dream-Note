import { apiFetch } from "@/lib/api/client";
import { passwordUpdateInput, accountError, accountErrorArray, accountMessage, resetTokenRes, resetPasswordInput, verifyResetOTPInput} from "@/types/accounts"

// Send otp to new email address for email update
// Return type may be array or object due to use of mongoose internal validator
export async function requestEmailUpdate(email: string){
    return apiFetch<accountError | accountErrorArray | accountMessage, {email: string}>('/users/request-email-update', {method: 'POST', body: {email}})
}

// Verify otp and automatically update the users email to the email associated with saved otp
export async function verifyOTPAndUpdateEmail({otp}: {otp: string}) {
    return apiFetch<accountError | accountMessage, {otp: string}>('/users/update-email', {method: 'PATCH', body: {otp}})
}

// Send otp to existing email address for password reset
export async function requestPasswordReset(email: string){
    return apiFetch<accountError | accountMessage, {email: string}>('/users/request-password-reset', {method: 'POST', body: {email}})
}

// Verify otp for password reset and return a temporary reset token
export async function verifyResetOTP(data: {otp: string, email: string}) {
    return apiFetch<accountError | resetTokenRes, verifyResetOTPInput>('/users/verify-reset-otp', {method: 'POST', body: data})
}

// Reset password while logged out using token
// Return type may be array or object due to use of mongoose internal validator
export async function resetPassword(password: string, resetToken: string){
    return apiFetch<accountError | accountErrorArray | accountMessage, resetPasswordInput>('/users/reset-password', {method: 'PATCH', body: {password, resetToken}})
}

// Reset password while logged in using current password
// Return type may be array or object due to use of mongoose internal validator
export async function updatePassword(data:passwordUpdateInput) {
    return apiFetch<accountErrorArray | accountMessage, passwordUpdateInput>('/users/update-password', {method: 'PATCH', body: data})
}