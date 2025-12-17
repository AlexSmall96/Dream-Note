import { apiFetch } from "./client";

export type DreamBodyType = {
    dream:{
        title?: string,
        description?: string,
        notes?: string
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