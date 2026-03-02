import { injectable } from "inversify";
import { getStartAndEndDates, getYearRange } from "../utils/dateRange.js";
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

    public async getLast6MonthsCounts(owner: string):Promise<{_id: { year: number, month: number }, count: number}[]> {
        const now = new Date()
        const firstDayOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const startDate = new Date(firstDayOfThisMonth.getFullYear(), firstDayOfThisMonth.getMonth() - 6, 1)
        const endDate = firstDayOfThisMonth

        const results = await Dream.aggregate([
            {
                $match: {
                    owner: new Types.ObjectId(owner),
                    date: { $gte: startDate, $lt: endDate }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1
                }
            }
        ])
        return results
    }


    public async normalizeMonthCount(owner: string) {
        const monthNames = [
            "Jan","Feb","Mar","Apr","May","Jun",
            "Jul","Aug","Sep","Oct","Nov","Dec"
        ]
        const now = new Date()
        const results = await this.getLast6MonthsCounts(owner)

        if (results.length === 0){
            return results
        }

        for (let i=5; i>=0; i--){
            const date = new Date(now.getFullYear(), now.getMonth()-i-1, 1)
            const monthNumber = date.getMonth() + 1
            const year = date.getFullYear()
            if (!results.find(value => value._id.month === monthNumber)){
                results.push({_id: {month: monthNumber, year}, count: 0})
            }
        }

        results.sort((a, b) => {
            if (a._id.year !== b._id.year) {
                return a._id.year - b._id.year
            }
            return a._id.month - b._id.month
        })

        const formatted = results.map(result => {
            return {
                month: result._id.month, label: monthNames[result._id.month-1], year: result._id.year, count: result.count
            }
        })
        return formatted
    }
}