import { apiFetch } from "./client";
import { DreamFullView } from "@/types/dreams";
import { ThemeResponse } from "@/types/themes";

export type DreamBodyType = {
    dream:{
        title?: string,
        description?: string,
        notes?: string
    },
    themes: string[]
}

export type DreamOverview = {
    title: string,
    date: Date,
    _id: string
}


export type DreamList = {
    dreams: DreamOverview[]
}

type DreamResponseType = {
    dream: DreamFullView,
    themes?: ThemeResponse[]
}

type ErrorMsg = {
    error: string
}

type DreamAnalysisBody = {
    description: string
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

export async function updateDream(id: string, body: DreamBodyType) {
    return apiFetch<DreamResponseType | ErrorMsg , DreamBodyType>(`/dreams/update/${id}`, {method: 'PATCH', body}
    )
}

export async function fetchAnalysis(body: DreamAnalysisBody){
    return apiFetch<DreamAnalysisResponse, DreamAnalysisBody>(`/dreams/analysis`, {method: 'POST', body})
}