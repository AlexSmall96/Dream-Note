import { injectable, inject } from "inversify";
import { ThemeService } from "../themes/theme.service.js";
import { Dream } from "../../models/dream.model.js";
import { DreamInterface } from "../../interfaces/dream.interfaces.js";
import { AIService } from "./ai.service.js";
import { FilterService } from "./filter.service.js";

export enum prompts {
    title = 'Return exactly one short title for the provided dream.',
    themes =  'Return 1-4 one word themes for the provided dream. Seperate them by commas without spaces.',
    analysis = `Return a short interpretation of the provided dream. Include only the interpretation itself without any \n.
                Never use self referntial langugae and never include a follow up question.`
}

@injectable()
export class DreamService {
    constructor(
        @inject(ThemeService) private themeService: ThemeService,
        @inject(AIService) private aiService: AIService,
        @inject(FilterService) private filterService: FilterService
    ){}

    // Save dream used by logNewDream
    private async saveDream(data: DreamInterface, userId: string){
        const dream = new Dream({...data, owner: userId});
        await dream.save()
        return dream
    }
    public async logNewDreamWithThemes(dreamData: DreamInterface, incomingThemes: string[], userId: string){
        const {dream, themes} = await this.aiService.addAIDataToDream(dreamData, incomingThemes)
        const savedDream = await this.saveDream(dream, userId)

        if (themes && themes.length > 0){
            const savedThemes = await this.themeService.addThemesToDream(savedDream._id.toString(), themes)
            return {dream: savedDream, themes: savedThemes}
        }
        return {dream}
    }

    public async getAiAnalysis(description: string, params: {tone: string, style: string}) {
        const DEV = process.env.DEV
        if (DEV && params){
            const analysis = `Mock analysis response. Description: ${description}`
            const fullAnalysis = analysis + ` Tone: ${params.tone ?? 'No tone provided'}. Style: ${params.style ?? 'No style provided'}.`
            return fullAnalysis
        }
        if (DEV){
            return `Mock analysis response. Description: ${description}`
        }
        const analysis = this.aiService.generateAnalysis(description, params)
        return analysis
    }

    public async getDreamsWithStats(userId: string, {title, startDate, endDate, limit, skip, sort}: {
        title: RegExp,
        startDate: Date
        endDate: Date
        limit: number
        skip: number
        sort: boolean
    }) {
        const [dreams, monthlyTotals] = await Promise.all([
            this.filterService.getFilteredDreams(userId, title, startDate, endDate, limit, skip, sort),
            this.filterService.getMonthlyDreamStats(userId, startDate.getFullYear())
        ])

        return { dreams, monthlyTotals }
    }

    public async getDreamAndThemes(dreamId:string, owner: string){
        const dream = await Dream.findOne({_id: dreamId, owner})
        const themes = await this.themeService.handleGetDreamThemes(dreamId)
        return {dream, themes}
    }

    public async updateDreamAndSyncThemes(dreamId: string, dreamData: DreamInterface, themes: string[]){
        const normalizedDescription = dreamData.description?.trim() || null
        const existingDream = await Dream.findByIdOrThrowError(dreamId)
        const dream = await Dream.findOneAndUpdate({_id: dreamId}, {...dreamData, description: normalizedDescription}, {new: true})
        
        await this.themeService.removeThemesIfDescriptionRemoved(
            existingDream.description, 
            normalizedDescription, 
            dreamId
        )

        const syncedThemes = normalizedDescription ? await this.themeService.syncThemes(dreamId, themes) :[]
        return {dream, themes: syncedThemes}
    }

    public async deleteDream(dreamId: string, owner: string){
        const dream = await Dream.findOneAndDelete({_id: dreamId, owner})
        return dream
    }  
}