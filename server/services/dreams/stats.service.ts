import { injectable } from "inversify";
import { getYearRange } from "../utils/dateRange.js";
import { Types } from "mongoose";
import { Dream } from "../../models/dream.model.js";
import { Theme } from "../../models/theme.model.js";


@injectable()
export class StatsService {

    public async getMonthlyDreamStats(
        owner: string,
        year: number) 
    {
        const [startDate, endDate] = getYearRange(year)
        const results = await Dream.aggregate([
            {
                $match: {owner: new Types.ObjectId(owner), date: { $gte: startDate, $lt: endDate }}
            },
            {
                $group: {
                    _id: {
                        month: { $month: '$date' },
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ])
        return results.reduce<Record<number, number>>((acc, item) => {
            acc[item._id.month] = item.count
            return acc
        }, {})
    }

    public async getTotalNoDreams(owner: string){
        const dreams = await Dream.find({owner})
        return dreams.length
    }

    public async getDreamsPastMonth(owner: string) {
        const now = new Date();
        const startDate = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);

        return Dream.countDocuments({
            owner,
            date: { $gte: startDate }
        })
    }

    public async getTopThemes(owner: string, n:number = 4){
        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
        const themeCounts = await Theme.aggregate([
            {
                $match: {
                    owner,
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: "$theme",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ])
        if (themeCounts.length === 0) return []
        const total = themeCounts.reduce((sum, t) => sum + t.count, 0)
    }

}