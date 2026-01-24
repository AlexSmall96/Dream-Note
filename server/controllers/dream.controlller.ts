import { injectable, inject } from "inversify";
import { DreamInterface } from "../interfaces/dream.interfaces.js"
import { Dream } from "../models/dream.model.js";
import { DreamService } from "../services/dream.service.js";

// Controller clas for Dream model
@injectable()
export class DreamController {
    constructor(
        @inject(DreamService) private dreamService: DreamService,
    ){}
    // Log new dream
    public async handleLogDream(data: DreamInterface, owner: string){
        const dream = new Dream({...data, owner});
        await dream.save()
        return dream
    }

    // View details for a single dream
    public async handleViewDream(dreamId: string, owner: string){
        const dream = await Dream.findOne({_id: dreamId, owner})
        return dream
    }

    // Update dream
    public async handleUpdateDream(update: DreamInterface, dreamId: string, userId: string){
        const dream = await Dream.findOneAndUpdate({_id: dreamId, owner: userId}, update, {new: true})
        return dream
    }

    // Delete dream
    public async handleDeleteDream(dreamId: string, owner: string){
        const dream = await Dream.findOneAndDelete({_id: dreamId, owner})
        return dream
    }    
}