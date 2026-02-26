// AI Analysis body and response
export type DreamAnalysisBody = {
    description: string
    params: {
        tone?: string,
        style?: string,
        length?: string
    }
}

export type DreamAnalysisResponse = {
    analysis: string
}   

export type DreamAnalysisOptions = {
    options: {
        tone: string[],
        style: string[],
        length: string[]
    }
}

export type SaveAnalysisBody = {
    text: string,
    tone: string,
    style: string,
    length: string
}

export type SavedAnalysis = {
    _id: string,
    text: string,
    tone: string,
    style: string,
    length: string,
    descriptionSnapshot: string,
    createdAt: Date,
    isFavorite: boolean,
    modelUsed: string
}

export type SavedAnalysesResponse = {
    analyses: SavedAnalysis[]
}