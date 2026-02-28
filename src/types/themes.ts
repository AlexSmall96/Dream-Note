export type ThemeResponse = {
    theme: string,
    dream: string,
    _id: string
}

export type ThemeWithDreamDataResponse = {
    theme: string,
    dream: {
        title: string,
        date: Date,
        _id: string
    },
    _id: string
}

export type ThemeCounts = {
    [theme: string]: number
}


export type ThemeListWithCounts = {
    themes: ThemeWithDreamDataResponse[]
    counts: ThemeCounts
}