export type DreamFormType = {
    title?: string,
    description?: string,
    notes?: string
}

export type DreamOverview = {
    title: string,
    date: Date,
    _id: string
}

export type DreamFullView = {
    title: string,
    description?: string,
    notes?: string,
    date: Date,
    owner: string,
    _id: string,
    __v: number
}
