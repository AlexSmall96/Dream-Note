import { apiFetch } from "@/lib/api/client";
import {user, userError} from "@/types/users"

type profileUpdateInput = {
    email?: string,
    currPassword?: string,
    password?: string
}

export async function updateProfile(data: profileUpdateInput){
    return apiFetch<user | userError, profileUpdateInput>('/users/update', {method: 'PATCH', body: data})
}