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
import { MONTH_OPTIONS, MonthLabel } from '@/lib/filters/dateRanges'

export async function logNewDream(body: DreamBodyType){
    return apiFetch<DreamResponseType | ErrorMsg , DreamBodyType>('/dreams/log', {method: 'POST', body})
}

export async function fetchDreams({year, month, sort = false}:{year: number, month: MonthLabel, sort: boolean}) {
    const monthNumber = MONTH_OPTIONS[month]
    return apiFetch<DreamList>(`/dreams?year=${year}&month=${monthNumber}&limit=${10}&sort=${sort}`)
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