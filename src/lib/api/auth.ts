import { apiFetch } from "@/lib/api/client";
import {userError, authInput, user, logoutSuccess, currentUser} from "@/types/users"

export async function signup(data: authInput) {
    return apiFetch<user | userError, authInput>('/users/signup', {method: 'POST', body: data})
}

export async function login(data: authInput){
    return apiFetch<user | userError, authInput>('/users/login', {method: 'POST', body: data})
}

export async function loginGuest(){
    return apiFetch<user>('/users/login-guest', {method: 'POST'})
}

export async function fetchCurrentUser() {
    return apiFetch<currentUser | userError>('/users/auth/me');
}

export async function logout(){
    return apiFetch<logoutSuccess>('/users/logout', {method: 'POST'})
}
