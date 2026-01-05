import { apiFetch } from "./client";

export type DreamBodyType = {
    dream:{
        title?: string,
        description?: string,
        notes?: string
    }
}

export type DreamOverview = {
    title: string,
    date: Date,
    _id: string
}


export type DreamList = {
    dreams: DreamOverview[]
}

export type DreamResponseType = {
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

type DreamAnalysisBody = {
    dream: {
        description: string
    }, 
    tone?: string,
    style?: string
}

type DreamAnalysisResponse = {
    analysis: string
}   

export async function logNewDream(body: DreamBodyType){
    return apiFetch<DreamResponseType | ErrorMsg , DreamBodyType>('/dreams/log', {method: 'POST', body})
}

export async function fetchDreams() {
    return apiFetch<DreamList>('/dreams')
}

export async function fetchFullDream(id: string){
    return apiFetch<DreamResponseType>(`/dreams/view/${id}`)
}

export async function fetchAnalysis(body: DreamAnalysisBody){
    return apiFetch<DreamAnalysisResponse, DreamAnalysisBody>(`/dreams/analysis`, {method: 'POST', body})
}