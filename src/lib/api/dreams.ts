import { apiFetch } from "@/lib/api/client";
import { DreamFullView } from "@/types/dreams";
import { 
    DreamBodyType, 
    DreamAnalysisResponse, 
    DreamResponseType, 
    ErrorMsg, 
    DreamList, 
    DreamAnalysisBody 
} from "@/types/dreams";

export async function logNewDream(body: DreamBodyType){
    return apiFetch<DreamResponseType | ErrorMsg , DreamBodyType>('/dreams/log', {method: 'POST', body})
}

export const options:{[key: string]: number} = {'Last 7 days': 7, 'Last month': 31, 'Last 2 months': 61,'Last 6 months': 183, 'Last year': 365, 'All time': 22000}
export const optionKeys = Object.keys(options)

export async function fetchDreams({from, limit}:{from: string, limit: number}) {
    const daysAgo = options[from]
    return apiFetch<DreamList>(`/dreams?daysAgo=${daysAgo}&limit=${limit}`)
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