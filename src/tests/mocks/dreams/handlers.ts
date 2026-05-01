import baseUrl from "@/tests/setup/setUrl";
import { http, HttpResponse } from "msw";
import { dreamOneData, dreamTwoData, dreamOneThemes, dreamTwoThemes, themes, dreamOneId, dreamTwoId, dreams, dreamThreeId, dreamThreeData } from "@/tests/mocks/dreams/data";

const url = baseUrl + '/dreams'

export const dreamsHandlers = [
    http.get(`${url}/view/${dreamOneId}`, () => {
        return HttpResponse.json({
            dream: dreamOneData,
            themes: dreamOneThemes,
        }, {status: 200})
    }),
    http.get(`${url}/view/${dreamTwoId}`, () => {
        return HttpResponse.json({
            dream: dreamTwoData,
            themes: dreamTwoThemes,
        }, {status: 200})
    }),    
    http.get(`${url}/view/${dreamThreeId}`, () => {
        return HttpResponse.json({
            dream: dreamThreeData,
            themes: [],
        }, {status: 200})
    }),
    http.get(`${url}/ai-options`, () => {
        return HttpResponse.json({
            options: { 
            tone: ['neutral', 'caring', 'excited'],
            style: ['imaginative','realistic'],
            length: ['brief', 'concise']}
        }, {status: 200})
    }),
    http.get(`${baseUrl}/themes`, () => {
        return HttpResponse.json({themes}, {status: 200})
    }),
    http.get(`${url}`, () => {
        return HttpResponse.json({dreams}, {status: 200})
    })
]