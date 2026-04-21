import { injectable } from "inversify";
import { getYearRange } from "../utils/dateRange.js";
import { Types } from "mongoose";
import { Dream } from "../../models/dream.model.js";

@injectable()
export class DreamStatsService {

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

    public async getOldestDreamDate(owner: string){
        const oldestDream = await Dream.findOne({owner}).sort({date: 1})
        return oldestDream ? oldestDream.date : null
    }

    public async getNoAnalysedDreams(owner: string){
        const dreams = await Dream.find({owner, analyses: { $exists: true, $not: { $size: 0 } } })
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

    public async getLast6MonthsCounts(owner: string):Promise<{_id: { year: number, month: number }, dreams: number}[]> {
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
                    dreams: { $sum: 1 }
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

    public async getUniqueYears(owner: string): Promise<string[]>{
        const dreams = await Dream.find({owner})
        const years = dreams.map(dream => dream.date.getFullYear().toString())
        const uniqueYears = [...new Set(years)]
        return uniqueYears
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
                results.push({_id: {month: monthNumber, year}, dreams: 0})
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
                month: result._id.month, label: monthNames[result._id.month-1], year: result._id.year, dreams: result.dreams
            }
        })
        return formatted
    }
}