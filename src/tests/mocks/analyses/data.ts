import { SavedAnalysis } from "@/types/aiAnalysis";

export const climbingDreamAnalyses: SavedAnalysis[] = [
    {   
        _id: '1',
        text: 'This dream could symbolize your current struggles and challenges in life. ',
        tone: 'neutral',
        style: 'imaginative',
        length: 'brief',
        descriptionSnapshot:'I was climbing a steep mountain with no clear path.',   
        createdAt: new Date(),
        isFavorite: true,
        modelUsed: 'gpt-4'
    }, {
        _id: '2',
        text: 'This dream may represent your resilience and determination in overcoming obstacles.',
        tone: 'caring',
        style: 'realistic',
        length: 'brief',
        descriptionSnapshot:'I was climbing a very difficult mountain with no clear path.',   
        createdAt: new Date(),
        isFavorite: false,
        modelUsed: 'gpt-4'        
    }
]