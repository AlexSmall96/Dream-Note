import { apiFetch } from "@/lib/api/client";
import { 
    DreamAnalysisResponse, 
    DreamAnalysisBody,
    DreamAnalysisOptions,
    SavedAnalysesResponse,
    SaveAnalysisBody,
    SavedAnalysis
} from "@/types/aiAnalysis";

export async function fetchAiOptions(){
    return apiFetch<DreamAnalysisOptions>('/dreams/ai-options')
}

export async function fetchAnalysis(body: DreamAnalysisBody){
    return apiFetch<DreamAnalysisResponse, DreamAnalysisBody>(`/dreams/analysis`, {method: 'POST', body})
}

export async function fetchSavedAnalyses(dreamId: string){
    return apiFetch<SavedAnalysesResponse>(`/dreams/${dreamId}/analyses`)
}

export async function saveNewAnalysis(dreamId: string, body: SaveAnalysisBody){
    return apiFetch<SavedAnalysis, SaveAnalysisBody>(`/dreams/${dreamId}/analysis`, {method: 'POST', body})
}

export async function toggleFavoriteAnalysis(dreamId: string, analysisId: string){
    return apiFetch<SavedAnalysis>(`/dreams/update/${dreamId}/analyses/${analysisId}`, {method: 'PATCH'})
}

export async function deleteAnalysis(dreamId: string, analysisId: string){
    return apiFetch<SavedAnalysis>(`/dreams/delete/${dreamId}/analyses/${analysisId}`, {method: 'DELETE'})
}

