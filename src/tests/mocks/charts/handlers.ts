import { http, HttpResponse } from "msw";
import { themes, themeData, dreamCounts } from '@/tests/mocks/charts/data'
import baseUrl from "@/tests/setup/setUrl";

export const themeStatsUrl = `${baseUrl}/themes/chart-stats`
export const dreamStatsUrl = `${baseUrl}/dreams/chart-stats`

export const chartHandlers = [

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