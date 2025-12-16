import { apiFetch } from "./client";

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

export async function signup(data: authInput) {
    return apiFetch<user | errorMsgs, authInput>('/users/signup', {method: 'POST', body: data})
}

export async function login(data: authInput){
    return apiFetch<user | errorMsgs, authInput>('/users/login', {method: 'POST', body: data})
}

export async function getCurrentUser() {
    return apiFetch<user>('/users/auth/me', {});
}
