import { ThemeMonthCount } from "@/types/themes";


const now = new Date()
const data: ThemeMonthCount[] = []

const themes = ['Fear', 'Nature', 'Adventure', 'Animals', 'Freedom']
const monthLabels: string[] = []

// Generate mock data for ThemeBarChart
for (let i=1; i<=6; i++){
    const date = new Date(now.getFullYear(), now.getMonth() - i, 27)
    const themeCounts = themes.reduce<Record<string, number>>((acc, curr, index) => {
        acc[curr] = index + i
        return acc
    }, {})

    const monthLabel = date.toLocaleString('en-US', { month: 'short' })
    data.push({
        month: monthLabel, ...themeCounts
    })

    monthLabels.push(monthLabel)

}

export {themes, data, monthLabels}