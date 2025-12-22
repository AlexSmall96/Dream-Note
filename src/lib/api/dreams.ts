import { apiFetch } from "./client";

export type DreamBodyType = {
    dream:{
        title?: string,
        description?: string,
        notes?: string
    }
}

type DreamList = {
    dreams: {
        title: string,
        date: Date,
        _id: string
    }
}

type DreamResponseType = {
    dream: {
        title: string,
        description?: string,
        notes?: string,
        date: Date,
        ower: string,
        _id: string,
        __v: number
    },
    themes?: string[]
}

type ErrorMsg = {
    error: string
}

export async function logNewDream(data: DreamBodyType){
    return apiFetch<DreamResponseType | ErrorMsg , DreamBodyType>('/dreams/log', {method: 'POST', body: data})
}

export async function fetchDreams() {
    return apiFetch<DreamList>('/dreams')
}

export async function fetchFullDream(id: string){
    return apiFetch(`/dreams/view/${id}`)
}