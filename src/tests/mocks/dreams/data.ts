import { DreamFullView, DreamOverview } from "@/types/dreams"
import { ThemeResponse } from "@/types/themes"

const dreamOneId = '12345'
const dreamTwoId = '67890'
const dreamThreeId = '11111'

const dreamOneData: DreamFullView = {
    date: new Date(),
    title: "Mountain Climb",
    description: 
        `I was climbing a steep mountain with no clear path. 
        The higher I went, the more difficult it became, but the view kept getting more beautiful.`,   
    notes: "I had just booked a hike with my Dad that day.",
    owner: "user123",
    _id: dreamOneId,
    __v: 0
}

const dreamTwoData: DreamFullView = {
    date: new Date(),
    title: "School Again",
    description:
        `I was back in school, unprepared for an important exam. 
        I couldn’t remember anything I had studied and felt completely overwhelmed.`,
    owner: "user123",
    _id: dreamTwoId,
    __v: 0
}

const dreamThreeData: DreamFullView = {
    date: new Date(),
    title: "Flying in the City",
    description: "",
    owner: "user123",
    _id: dreamThreeId,
    __v: 0
}

const dreamOneThemes: ThemeResponse[] = [
    {theme: 'Adventure', dream: dreamOneId, _id: '12345t1'},
    {theme: 'Challenge', dream: dreamOneId, _id: '12345t2'},
    {theme: 'Nature', dream: dreamOneId, _id: '12345t3'},
    {theme: 'Love', dream: dreamOneId, _id: '12345t4'},
    {theme: 'Fear', dream: dreamOneId, _id: '12345t5'},
    {theme: 'Achievement', dream: dreamOneId, _id: '12345t6'}
]

const dreamTwoThemes: ThemeResponse[] = [
    {theme: 'School', dream: dreamTwoId, _id: '67890t1'},
    {theme: 'Anxiety', dream: dreamTwoId, _id: '67890t2'},
    {theme: 'Unpreparedness', dream: dreamTwoId, _id: '67890t3'},
]

const themes = [...dreamOneThemes, ...dreamTwoThemes].map(t => t.theme)

const dreams: DreamOverview[] = [
    {
        date: new Date(),
        title: "Mountain Climb",
        _id: dreamOneId,
    },{
        date: new Date(),
        title: "School Again",
        _id: dreamTwoId,
    }
]

export {dreamOneData, dreamTwoData, dreamThreeData, dreamOneThemes, dreamTwoThemes, themes, dreamOneId, dreamTwoId, dreamThreeId, dreams}
