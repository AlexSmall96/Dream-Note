import { injectable } from "inversify";
import { Theme } from "../../models/theme.model.js";
import { Types } from "mongoose";

@injectable()
export class CountsService {
    
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
}