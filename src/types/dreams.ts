import { ThemeResponse } from "@/types/themes";

// Date as string to be used in edit and create forms
export type DreamFormType = {
    title: string,
    description: string,
    notes: string,
    date: string
}

// Data for dreams list
export type DreamOverview = {
    title: string,
    date: Date,
    _id: string
}

export type monthlyTotalType = {
    [month: string]: number
}

export type DreamList = {
    dreams: DreamOverview[]
}

export type DreamStats = {
    total: number,
    monthlyTotals: monthlyTotalType,
    thisMonthTotal: number
}

// Main dream view
export type DreamFullView = {
    title: string,
    description?: string,
    notes?: string,
    date: Date,
    owner: string,
    _id: string,
    __v: number
}

// Date as Date type for payload sent to API in create and update
export type DreamBodyType = {
    dream:{
        title: string | null,
        description: string | null,
        notes: string | null,
        date: Date
    },
    themes: string[]
}

// Response from API for dream full view
export type DreamResponseType = {
    dream: DreamFullView,
    themes?: ThemeResponse[]
}


export type ErrorMsg = {
    error: string
}
