import { injectable } from "inversify";
import { Theme } from "../../models/theme.model.js";
import { Types } from "mongoose";

type topTheme = {
    _id: string,
    total: number
}

type monthlyCount = {
    _id: { 
        theme: string, 
        year: number, 
        month: number 
    }, 
    count: number 
}

type chartDataMonth = {
    [key: string]: string | number
}

@injectable()
export class ThemeStatsService {
    
    public async getThemeCounts (owner: string){
        const results = await Theme.aggregate([
            {
                $match: {owner: new Types.ObjectId(owner)}
            },
            {
                $group: {
                    _id: '$theme',
                    count: { $sum: 1 }
                }
            }
        ])
        
        const counts = results.reduce<Record<string, number>>((acc, item) => {
            acc[item._id] = item.count
            return acc
        }, {})
        return counts
    }


    public async getTop5ThemesMonthly(owner: string): Promise<{topThemes: topTheme[], monthlyCounts: monthlyCount[]}> {
        const now = new Date()

        const firstDayOfThisMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        )

        const startDate = new Date(
            firstDayOfThisMonth.getFullYear(),
            firstDayOfThisMonth.getMonth() - 6,
            1
        )

        const result = await Theme.aggregate([
            {
                $match: { owner: new Types.ObjectId(owner) }
            },
            {
                $lookup: {
                    from: "dreams",
                    localField: "dream",
                    foreignField: "_id",
                    as: "dreamDoc"
                }
            },{ 
                $unwind: "$dreamDoc" 
            },{
                $match: {
                    "dreamDoc.date": {
                        $gte: startDate,
                        $lt: firstDayOfThisMonth
                    }
                }
            },{
                $facet: {
                    topThemes: [
                        {
                            $group: {
                                _id: "$theme",
                                total: { $sum: 1 }
                            }
                        },
                        { $sort: { total: -1, _id: 1 } },
                        { $limit: 5 }
                    ],
                    monthlyCounts: [
                        {
                            $group: {
                                _id: {
                                    theme: "$theme",
                                    year: { $year: "$dreamDoc.date" },
                                    month: { $month: "$dreamDoc.date" }
                                },
                                count: { $sum: 1 }
                            }
                        }
                    ]
                }
            }
        ])
        return result[0]
    }

    public async normalizeTopThemesMonthly(owner:string):Promise<{themes: string[], data: chartDataMonth[]}> {
        const result = await this.getTop5ThemesMonthly(owner)
        const topThemes = result.topThemes.map((t: any) => t._id)
        const monthlyCounts = result.monthlyCounts

        const monthNames = [
            "Jan","Feb","Mar","Apr","May","Jun",
            "Jul","Aug","Sep","Oct","Nov","Dec"
        ]

        const now = new Date()
        const firstDayOfThisMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        )

        const chartData = []

        // Loop last 6 completed months (oldest → newest)
        for (let i = 6; i >= 1; i--) {
            const date = new Date(
                firstDayOfThisMonth.getFullYear(),
                firstDayOfThisMonth.getMonth() - i,
                1
            )

            const year = date.getFullYear()
            const month = date.getMonth() + 1
            const label = monthNames[month - 1]

            const row: any = { month: label }

            // Initialize all top themes to 0
            topThemes.forEach((theme: string) => {
                row[theme] = 0
            })

            // Fill counts if they exist
            monthlyCounts.forEach((entry: any) => {
                if (
                    entry._id.year === year &&
                    entry._id.month === month &&
                    topThemes.includes(entry._id.theme)
                ) {
                    row[entry._id.theme] = entry.count
                }
            })

            chartData.push(row)
        }

        return {
            themes: topThemes,
            data: chartData
        }
    }
}