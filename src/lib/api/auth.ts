import { apiFetch } from "@/lib/api/client";
import { resetPasswordInput, resetTokenRes, verifyResetOTPInput } from "@/types/accounts";
import { authInput, user, logoutSuccess, currentUser} from "@/types/auth"
import { SuccessResponse, ErrorResponse } from "@/types/responses";

export async function signup(data: authInput) {
    return apiFetch<{user: user, message: string} | ErrorResponse, authInput>('/auth/signup', {method: 'POST', body: data})
}

export async function login(data: authInput){
    return apiFetch<user | ErrorResponse, authInput>('/auth/login', {method: 'POST', body: data})
}

export async function loginGuest(){
    return apiFetch<user>('/auth/login-guest', {method: 'POST'})
}

export async function fetchCurrentUser() {
    return apiFetch<currentUser | ErrorResponse>('/auth/me');
}

export async function logout(){
    return apiFetch<logoutSuccess>('/auth/logout', {method: 'POST'})
}

export async function requestPasswordReset(email: string){
    return apiFetch<ErrorResponse | SuccessResponse, {email: string}>('/auth/request-password-reset', {method: 'POST', body: {email}})
}

export async function verifyResetOTP(data: {otp: string, email: string}) {
    return apiFetch<ErrorResponse | resetTokenRes, verifyResetOTPInput>('/auth/verify-reset-otp', {method: 'POST', body: data})
}

export async function resetPassword(password: string, resetToken: string){
    return apiFetch<ErrorResponse | SuccessResponse, resetPasswordInput>('/auth/reset-password', {method: 'PATCH', body: {password, resetToken}})
}
