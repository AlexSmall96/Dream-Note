import { apiFetch } from "@/lib/api/client";
import { 
    DreamAnalysisResponse, 
    DreamAnalysisBody,
    DreamAnalysisOptions
} from "@/types/dreams";

export async function fetchAiOptions(){
    return apiFetch<DreamAnalysisOptions>('/dreams/ai-options')
}

export async function fetchAnalysis(body: DreamAnalysisBody){
    return apiFetch<DreamAnalysisResponse, DreamAnalysisBody>(`/dreams/analysis`, {method: 'POST', body})
}

