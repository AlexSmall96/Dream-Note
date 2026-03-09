import { apiFetch } from "@/lib/api/client";
import { passwordUpdateInput} from "@/types/accounts"
import { ErrorResponse, SuccessResponse } from "@/types/responses";

export async function requestEmailUpdate(email: string){
    return apiFetch<ErrorResponse | SuccessResponse, {email: string}>('/users/request-email-update', {method: 'POST', body: {email}})
}

export async function verifyOTPAndUpdateEmail({otp}: {otp: string}) {
    return apiFetch<ErrorResponse | SuccessResponse, {otp: string}>('/users/update-email', {method: 'PATCH', body: {otp}})
}

export async function requestEmailVerification(){
    return apiFetch<ErrorResponse | SuccessResponse, {email: string}>('/users/request-email-verification', {method: 'POST'})
}

export async function verifyEmail(otp: string){
    return apiFetch<ErrorResponse | SuccessResponse, {otp: string}>('/users/verify-email', {method: 'PATCH', body: {otp}})
}

export async function updatePassword(data:passwordUpdateInput) {
    return apiFetch<ErrorResponse | SuccessResponse, passwordUpdateInput>('/users/update-password', {method: 'PATCH', body: data})
}