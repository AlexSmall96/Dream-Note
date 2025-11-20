import { injectable } from "inversify";
import { DreamInterface } from "../interfaces/dream.interfaces.js"
import { Dream } from "../models/dream.model.js";

// Controller clas for Dream model
@injectable()
export class DreamController {
    
    // Log new dream
    public async handleLogDream(data: DreamInterface, owner: string){
        const dream = new Dream({...data, owner});
        await dream.save()
        return dream
    }

    // Get a users dreams
    public async handleGetDreams(owner: string, title: RegExp, fromDate: Date, limit: number, skip: number){
        // Use aggregate to apply limit and skip first, then date and then search by title
        const dreams = await Dream.aggregate([
            {
                $match: {
                    owner: owner,
                    date: { $gte: fromDate }
                }
            },
            {$sort: { date: -1 }},
            {$skip: skip},
            {$limit: limit},
            {
                $match: {
                    title: { $regex: title }
                }
            }
        ]).project({title: 1, date: 1}) // Only return title and date for all dreams view
        return dreams
    }

    // View details for a single dream
    public async handleViewDream(dreamId: string){
        const dream = await Dream.findById(dreamId)
        return dream
    }

    // Update dream
    public async handleUpdateDream(update: DreamInterface, dreamId: string){
        const dream = await Dream.findByIdAndUpdateOrThrowError(dreamId, update)
        await dream.save()
        return dream
    }

    // Delete dream
    public async handleDeleteDream(dreamId: string){
        const dream = await Dream.findByIdAndDelete(dreamId)
        return dream
    }    
}