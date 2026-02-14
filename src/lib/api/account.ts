import { apiFetch } from "@/lib/api/client";
import { passwordUpdateInput, accountError, accountErrorArray, accountMessage} from "@/types/accounts"


export async function requestEmailUpdate(email: string){
    return apiFetch<accountError | accountMessage, {email: string}>('/users/request-email-update', {method: 'POST', body: {email}})
}

export async function verifyOTPAndUpdateEmail(otp: string) {
    return apiFetch<accountError | accountMessage, {otp: string}>('/users/update-email', {method: 'POST', body: {otp}})
}

export async function updatePassword(data:passwordUpdateInput) {
    return apiFetch<accountErrorArray | accountMessage, passwordUpdateInput>('/users/update-password', {method: 'PATCH', body: data})
}