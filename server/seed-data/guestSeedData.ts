export type dataType = {
    dream: {title: string, description: string, notes?: string, date: Date}
    themes: string[]
}

export const guestData:dataType[] = [
    {
        dream: {
            title: 'Dinner with elves',
            description: 'I was in a forest having dinner with elves. We were eating lembas bread.',
            date: new Date(2026, 0, 10)
        },
        themes: ['Forest', 'Nature', 'Fantasy', 'Adventure']
    }, {
        dream:{
            title: 'Missed Train',
            description: 'I slept in and missed my train to London.',
            notes: 'I had just booked a train ticket that day.',
            date: new Date(2026, 0, 11)
        }, 
        themes: ['Anxiety', 'Travel']
    }, {
        dream: {
            title: 'Holiday in France',
            description: 'I was on holiday in France with my family. It was very hot and we were drinking wine and watching the sunset.',
            date: new Date(2026, 0, 12)
        },
        themes: ['Holidays', 'Travel']
    },{
        dream: {
            title: 'Flying Dream',
            description: 'I was flying in my garden. It was really fun and exciting. I was above the trees.',
            date: new Date()
        }, 
        themes: ['Freedom', 'Adventure']
    }
]