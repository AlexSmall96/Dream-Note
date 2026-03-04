import { http, HttpResponse } from "msw";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
import {themes, data} from '@/tests/mocks/data'

if (!API_URL) {
  	throw new Error("PUBLIC_API_URL is not defined");
}


export const themeStatsUrl = `${API_URL}/themes/chart-stats`

export const handlers = [
    // Dashboard charts data
    http.get(themeStatsUrl, () => {
        return HttpResponse.json({
            themes, data
        }, {status: 200})
    }),
]