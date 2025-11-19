import { injectable } from "inversify";
import { DreamInterface } from "../interfaces/dream.interfaces.js"
import { Dream } from "../models/dream.model.js";

// Controller clas for Dream model
@injectable()
export class DreamController {
    
    // Log new dream
    public async handleLogDream(data: DreamInterface, owner: string){
        const {
            title, 
            description, 
            analysis,
            notes,
            date
        } = data;
        const dream = new Dream({
            title, 
            description, 
            date,
            analysis,
            notes,
            owner
        });
        await dream.save()
        return dream
    }
}