import baseUrl from "@/tests/setup/setUrl";
import { http, HttpResponse } from "msw";
import { climbingDreamAnalyses } from "./data";
import { DreamAnalysisBody } from "@/types/aiAnalysis";

export const analysesHandlers = [
    http.get(`${baseUrl}/dreams/12345/analyses`, async ({request}) => {
        const url = new URL(request.url)
        const filter = url.searchParams.get('filter')
        if (filter === 'favorites') {
            const favs = climbingDreamAnalyses.filter(a => a.isFavorite)
            return HttpResponse.json({analyses: favs}, { status: 200 })
        } else {
            return HttpResponse.json({analyses: climbingDreamAnalyses}, { status: 200 })
        }
    }),

    http.post(`${baseUrl}/dreams/analysis`, async ({request}) => {
        const requestBody = await request.json() as DreamAnalysisBody
        const style = requestBody.params.style
        if (style === 'imaginative') {
            return HttpResponse.json({analysis: 'An imaginative analysis'}, { status: 200 })
        } else if (style === 'realistic') {
            return HttpResponse.json({analysis: 'A realistic analysis'}, { status: 200 })
        }
    }),

    http.post(`${baseUrl}/dreams/12345/analysis`, async () => {
        return HttpResponse.json({message: 'Analysis saved'}, { status: 200 })
    })
]