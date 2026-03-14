import { apiFetch } from "@/lib/api/client";
import { ChartStats, DreamFullView, DreamUpdateType } from "@/types/dreams";
import { 
    DreamBodyType, 
    DreamResponseType, 
    DreamList, 
    DreamStats
} from "@/types/dreams";
import { MONTH_OPTIONS, MonthLabel } from '@/lib/filters/dateRanges'
import { ErrorResponse } from "@/types/responses";

export async function logNewDream(body: DreamBodyType){
    return apiFetch<DreamResponseType | ErrorResponse, DreamBodyType>('/dreams/log', {method: 'POST', body})
}

export async function fetchDreams({year, month, sort = false}:{year: number, month: MonthLabel, sort: boolean}) {
    const monthNumber = MONTH_OPTIONS[month]
    return apiFetch<DreamList>(`/dreams?year=${year}&month=${monthNumber}&limit=${10}&sort=${sort}`)
}

export async function fetchDreamCounts(year: number){
    return apiFetch<DreamStats>(`/dreams/stats?year=${year}`)
}

export async function fetchDreamChartStats(){
    return apiFetch<ChartStats>(`/dreams/chart-stats`)
}

export async function fetchSearchResults(search: string){
    return apiFetch<DreamList>(`/dreams?title=${search}`)
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

export async function updateDream(id: string, body: DreamUpdateType) {
    return apiFetch<DreamResponseType | ErrorResponse, DreamUpdateType>(`/dreams/update/${id}`, {method: 'PATCH', body}
    )
}

export async function deleteDream(id: string) {
    return apiFetch<DreamFullView>(`/dreams/delete/${id}`, {method: 'DELETE'})
}