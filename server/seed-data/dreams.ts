import { AnalysisInterface } from "../interfaces/dream.interfaces"
import { analyses } from "./analyses.js"

export type guestDataType = {
    dream: {
        title: string, 
        description: string, 
        notes?: string, 
        date: Date,
        analyses?: AnalysisInterface[]
    }
    themes: string[]
}

const NOW = new Date()

const { underwaterAnalyses, familyGatheringAnalyses } = analyses

export const guestData:guestDataType[] = [
    // --- 6 months ago (2 dreams)
    {
        dream: {
            title: 'Endless Library',
            description: 
                `I was inside a massive, endless library where the shelves stretched far beyond what I could see. 
                Every book I opened seemed to be about my own life, but slightly altered, like alternate versions of reality. 
                I kept searching for one specific book but could never find it.`,
            date: new Date(NOW.getFullYear(), NOW.getMonth() - 6, 3)
        },
        themes: ['Mystery', 'Knowledge', 'Self-discovery', 'Infinite Spaces']
    },
    {
        dream: {
            title: 'Ocean City',
            description: 
                `I was walking through a beautiful city that was slowly sinking into the ocean. 
                The streets were flooded with clear blue water, and people were calmly going about their lives as if nothing was wrong. 
                I felt both peaceful and uneasy at the same time.`,
            date: new Date(NOW.getFullYear(), NOW.getMonth() - 6, 14),
            notes: 'This was when I was on holiday in Spain, I had been swimming in the ocean that day.'
        },
        themes: ['Water', 'Change', 'Calm', 'Anxiety', 'Surreal']
    },

    // --- 5 months ago (1 dream)
    {
        dream: {
            title: 'Talking Animals',
            description: 
                `I found myself in a countryside field surrounded by animals that could talk. 
                They were debating philosophical questions about life and existence, 
                and I was trying to join in but struggled to understand their language fully.`,
            date: new Date(NOW.getFullYear(), NOW.getMonth() - 5, 9),
        },
        themes: ['Animals', 'Philosophy', 'Nature', 'Confusion']
    },

    // --- 4 months ago (1 dream)
    {
        dream: {
            title: 'Broken Elevator',
            description: 
                `I was trapped in a glass elevator that kept moving unpredictably between floors. 
                Sometimes it would shoot up rapidly, other times it would fall suddenly. 
                Outside the glass, I could see strange landscapes instead of a building interior.`,
            date: new Date(NOW.getFullYear(), NOW.getMonth() - 4, 18),
            notes: 'I ate alot before bed that night, which usually gives me weird dreams.'
        },
        themes: ['Anxiety', 'Loss of Control', 'Heights', 'Surreal']
    },

    // --- 3 months ago (2 dreams)
    {
        dream: {
            title: 'Desert Journey',
            description: 
                `I was walking alone through a vast desert under a burning sun. 
                Occasionally I would find small ruins or objects buried in the sand, hinting at a lost civilization. 
                I felt both isolated and strangely purposeful.`,
            date: new Date(NOW.getFullYear(), NOW.getMonth() - 3, 2)
        },
        themes: ['Isolation', 'Adventure', 'History', 'Survival']
    },
    {
        dream: {
            title: 'Concert Crowd',
            description: 
                `I was at a huge outdoor concert surrounded by thousands of people. 
                The music was loud and overwhelming, and at times I felt completely lost in the crowd, unable to find my friends or an exit.`,
            date: new Date(NOW.getFullYear(), NOW.getMonth() - 3, 21)
        },
        themes: ['Crowds', 'Anxiety', 'Music', 'Overwhelm']
    },

    // --- 2 months ago (4 dreams)
    {
        dream: {
            title: 'Snowy Cabin',
            description: 
                `I was staying in a quiet wooden cabin in the middle of a snowy forest. 
                Everything was silent except for the wind, and I spent time looking out the window, feeling calm but slightly lonely.`,
            date: new Date(NOW.getFullYear(), NOW.getMonth() - 2, 1),
            notes: 'This dream felt very peaceful, like a cozy escape from the world, but also a bit isolating.'
        },
        themes: ['Winter', 'Solitude', 'Nature', 'Calm']
    },
    {
        dream: {
            title: 'Lost Phone',
            description: 
                `I realized I had lost my phone in a busy city and spent the entire dream searching for it. 
                Every time I thought I found it, it turned out to be something else.`,
            date: new Date(NOW.getFullYear(), NOW.getMonth() - 2, 7)
        },
        themes: ['Anxiety', 'Loss', 'Modern Life', 'Frustration']
    },
    {
        dream: {
            title: 'Hidden Door',
            description: 
                `I discovered a hidden door in my house that led to a completely different place, 
                like a secret world filled with strange architecture and glowing plants.`,
            date: new Date(NOW.getFullYear(), NOW.getMonth() - 2, 15)
        },
        themes: ['Mystery', 'Discovery', 'Fantasy', 'Exploration']
    },
    {
        dream: {
            title: 'Time Loop Day',
            description: 
                `I kept reliving the same day over and over again, noticing small changes each time. 
                I tried to break the loop by making different choices, but nothing seemed to work.`,
            date: new Date(NOW.getFullYear(), NOW.getMonth() - 2, 26)
        },
        themes: ['Time', 'Repetition', 'Frustration', 'Control']
    },

    // --- 1 month ago (5 dreams)
    {
        dream: {
            title: 'Mountain Climb',
            description: 
                `I was climbing a steep mountain with no clear path. 
                The higher I went, the more difficult it became, but the view kept getting more beautiful.`,
            date: new Date(NOW.getFullYear(), NOW.getMonth() - 1, 2),
            notes: 'I was planning a hike with my Dad that day.'
        },
        themes: ['Adventure', 'Challenge', 'Nature', 'Achievement']
    },
    {
        dream: {
            title: 'School Again',
            description: 
                `I was back in school, unprepared for an important exam. 
                I couldn’t remember anything I had studied and felt completely overwhelmed.`,
            date: new Date(NOW.getFullYear(), NOW.getMonth() - 1, 6),
            notes: 'I often have dreams about being back at school or university.'
        },
        themes: ['Anxiety', 'School', 'Unprepared', 'Pressure']
    },
    {
        dream: {
            title: 'Chasing Shadows',
            description: 
                `I was running through dark streets chasing moving shadows that always stayed just out of reach. 
                The environment kept shifting around me.`,
            date: new Date(NOW.getFullYear(), NOW.getMonth() - 1, 12),
            notes: 'Very vivid. I had just tried a new magnesium supplement.'
        },
        themes: ['Fear', 'Mystery', 'Darkness', 'Pursuit']
    },
    {
        dream: {
            title: 'Underwater Breathing',
            description: 
                `I was swimming deep underwater and at first I was holding my breath, worried about how long I could last.
                Then I suddenly realized I could breathe as if I were on land, and the panic turned into amazement.
                I explored vast coral reefs filled with bright, glowing colors and strange fish that didn’t seem afraid of me.
                I swam through narrow caves and hidden tunnels, discovering entire underwater landscapes that felt untouched and ancient.
                The deeper I went, the quieter everything became,
                and I felt a strong sense of peace and freedom, like I could stay there forever without needing to return to the surface.`,
            date: new Date(NOW.getFullYear(), NOW.getMonth() - 1, 19),
            analyses: underwaterAnalyses,
            notes: 'I was watching Finding Nemo before bed, so I think that influenced this dream a lot.'
        },
        themes: ['Water', 'Freedom', 'Exploration', 'Wonder']
    },
    {
        dream: {
            title: 'Family Gathering',
            description: 
                `I was at a large family gathering in a warm, brightly lit house, with people talking, laughing, and moving between rooms. 
                There were long tables covered in food, and I kept stopping to have conversations with different relatives. 
                Some of them I recognized clearly, while others felt like family but looked unfamiliar, which gave the whole scene a slightly surreal feeling. 
                There was a strong sense of nostalgia, like revisiting a memory from childhood, and I felt happy and comforted being surrounded by everyone. 
                At times I would pause and just observe the room, noticing small details like shared jokes and quiet moments, 
                feeling both connected and slightly distant at the same time.`,
            date: new Date(NOW.getFullYear(), NOW.getMonth() - 1, 25),
            analyses: familyGatheringAnalyses,
            notes: 'This dream felt very vivid and emotional, like a mix of happy memories and the bittersweet feeling of how things change over time.'
        },
        themes: ['Family', 'Nostalgia', 'Connection', 'Joy']
    },
        {
            dream: {
            title: 'Endless Train Ride',
            description: `I was sitting on a train that seemed completely normal at first, quietly watching the countryside pass by outside the window. After a while, I noticed the scenery repeating itself in subtle ways, like the same tree or house appearing again and again. I got up to walk through the carriages, but each one looked almost identical, filled with people who didn’t seem to notice anything strange. Some passengers glanced at me briefly, as if they knew something I didn’t. I kept moving forward, expecting to find the end of the train, but it just continued endlessly. Eventually I started to feel uneasy, realizing I didn’t remember where I had boarded or where I was supposed to get off, and the idea that the train might never stop began to settle in.`,
            date: new Date(NOW.getFullYear(), NOW.getMonth() - 1, 1)
        },
        themes: []
    },{
    dream: {
        title: 'Strange Supermarket',
        description: `I was walking through a large supermarket, pushing a trolley down brightly lit aisles that seemed to stretch much farther than they should. At first everything looked ordinary, but as I paid closer attention, the products became increasingly strange. Labels didn’t quite make sense, and some items seemed to shift or change when I wasn’t looking directly at them. Other shoppers moved slowly and quietly, almost like they were following routines rather than actually shopping. I tried to find the exit, but every turn led me into another unfamiliar aisle. At one point, I reached a section where the shelves were completely empty, and the silence there felt heavy and unnatural. I started to feel a growing urgency to leave, but no matter which direction I chose, I couldn’t find a way out of the store.`,
        date: new Date(NOW.getFullYear(), NOW.getMonth() - 1, 11)
    },
        themes: []
}
]