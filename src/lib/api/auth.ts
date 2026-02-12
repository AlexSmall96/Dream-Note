import { apiFetch } from "@/lib/api/client";

type authInput = {
    email: string,
    password: string
}

type user = {
    id: string,
    email: string
}

type errorMsgs = {
    errors: {value: string, param: string, msg: string}[]
}

type logoutSuccess = {message: string }

export async function signup(data: authInput) {
    return apiFetch<user | errorMsgs, authInput>('/users/signup', {method: 'POST', body: data})
}

export async function login(data: authInput){
    return apiFetch<user | errorMsgs, authInput>('/users/login', {method: 'POST', body: data})
}

export async function loginGuest(){
    return apiFetch<user>('/users/login-guest', {method: 'POST'})
}

export async function fetchCurrentUser() {
    return apiFetch<user | errorMsgs>('/users/auth/me');
}

export async function logout(){
    return apiFetch<logoutSuccess>('/users/logout', {method: 'POST'})
}
