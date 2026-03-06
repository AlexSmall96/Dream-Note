import { last6monthsDreams } from "@/types/dreams";
import { ThemeMonthCount } from "@/types/themes";
import { MonthLabel } from "@/lib/filters/dateRanges";

const now = new Date()
const themeData: ThemeMonthCount[] = []
const dreamCounts: last6monthsDreams = []

const themes = ['Fear', 'Nature', 'Adventure', 'Animals', 'Freedom']
const monthLabels: MonthLabel[] = []

// ThemeBarChart data
for (let i=1; i<=6; i++){
    const date = new Date(now.getFullYear(), now.getMonth() - i, 27)
    const themeCounts = themes.reduce<Record<string, number>>((acc, curr, index) => {
        acc[curr] = index + i
        return acc
    }, {})

    const monthLabel = date.toLocaleString('en-US', { month: 'short' }) as MonthLabel
    themeData.push({
        month: monthLabel, ...themeCounts
    })
    monthLabels.push(monthLabel)
}

// DreamsLineChart data
for (let i=1; i<=6; i++){
    const year = now.getFullYear()
    const date = new Date(year, now.getMonth() - i, 27)
    const monthLabel = date.toLocaleString('en-US', { month: 'short' }) as MonthLabel

    dreamCounts.push({
        year, month: date.getMonth(), label: monthLabel, dreams: 2 * i + 1
    })
}   

export {themes, themeData, dreamCounts, monthLabels}