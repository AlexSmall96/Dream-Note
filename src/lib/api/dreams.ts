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
import { DATE_RANGE_OPTIONS, DateRangeLabel } from '@/lib/filters/dateRanges'

export async function logNewDream(body: DreamBodyType){
    return apiFetch<DreamResponseType | ErrorMsg , DreamBodyType>('/dreams/log', {method: 'POST', body})
}

export async function fetchDreams({from, limit}:{from: DateRangeLabel, limit: number}) {
    const daysAgo = DATE_RANGE_OPTIONS[from]
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