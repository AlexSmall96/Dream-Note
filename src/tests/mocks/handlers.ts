import { http, HttpResponse } from "msw";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { themes, themeData, dreamCounts } from '@/tests/mocks/data'

if (!API_URL) {
  	throw new Error("PUBLIC_API_URL is not defined");
}


export const themeStatsUrl = `${API_URL}/themes/chart-stats`
export const dreamStatsUrl = `${API_URL}/dreams/chart-stats`

export const handlers = [
    // Dashboard charts data
    http.get(themeStatsUrl, () => {
        return HttpResponse.json({
            themes, data: themeData
        }, {status: 200})
    }),
    http.get(dreamStatsUrl, () => {
        return HttpResponse.json({
            dreamCounts
        }, {status: 200})        
    })
]