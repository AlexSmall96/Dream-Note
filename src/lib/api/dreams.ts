import { apiFetch } from "@/lib/api/client";
import { DreamFullView } from "@/types/dreams";
import { ThemeResponse } from "@/types/themes";

export type DreamBodyType = {
    dream:{
        title: string | null,
        description: string | null,
        notes: string | null,
        date: Date
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

export const options:{[key: string]: number} = {'Last year': 365, 'Last 6 months': 183, 'Last 2 months': 61, 'Last month': 31, 'Last 7 days': 7}
export const optionKeys = Object.keys(options)

export async function fetchDreams(from: string) {
    const daysAgo = options[from]
    return apiFetch<DreamList>(`/dreams?daysAgo=${daysAgo}`)
}

export async function fetchFullDream(id: string){
    const response = await apiFetch<DreamResponseType>(`/dreams/view/${id}`)
    return {
        ...response, 
        dream: {
            ...response.dream,
            date: new Date(response.dream.date)
        }
    }
}

export async function updateDream(id: string, body: DreamBodyType) {
    return apiFetch<DreamResponseType | ErrorMsg , DreamBodyType>(`/dreams/update/${id}`, {method: 'PATCH', body}
    )
}

export async function fetchAnalysis(body: DreamAnalysisBody){
    return apiFetch<DreamAnalysisResponse, DreamAnalysisBody>(`/dreams/analysis`, {method: 'POST', body})
}

export async function deleteDream(id: string) {
    return apiFetch<DreamFullView>(`/dreams/delete/${id}`, {method: 'DELETE'})
}