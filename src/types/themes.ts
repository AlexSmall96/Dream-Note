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

export type ThemeList = {
    themes: ThemeWithDreamDataResponse[]
}