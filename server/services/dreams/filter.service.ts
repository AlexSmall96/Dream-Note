import { injectable } from "inversify";
import { getYearRange } from "../utils/dateRange.js";
import { Types } from "mongoose";
import { Dream } from "../../models/dream.model.js";


@injectable()
export class FilterService {

    public async getFilteredDreams (owner: string, title: RegExp, startDate: Date, endDate: Date, limit: number, skip: number, sort: boolean){
        const dreams = await Dream.aggregate([
            {
                $match: {
                    owner: new Types.ObjectId(owner),
                    date: { $gte: startDate, $lt: endDate },
                    title: { $regex: title }
                }
            },
            {$sort: { date: sort? 1: -1 }},
            {$skip: skip},
            {$limit: limit},
        ]).project({title: 1, date: 1}) // Only return title and date for all dreams view
        return dreams
    }

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
}