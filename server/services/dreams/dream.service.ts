import { injectable, inject } from "inversify";
import { ThemeService } from "../themes/theme.service.js";
import { Dream } from "../../models/dream.model.js";
import { DreamInterface, Tone, Style, Length } from "../../interfaces/dream.interfaces.js";
import { AIService } from "./ai.service.js";
import { StatsService} from "./stats.service.js";
import { AppError } from "../../utils/appError.js";
import { Types } from "mongoose";

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
        @inject(StatsService) private statsService: StatsService
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
            const savedThemes = await this.themeService.addThemesToDream(savedDream._id.toString(), themes, userId)
            return {dream: savedDream, themes: savedThemes}
        }
        return {dream}
    }

    public async getAiAnalysis(description: string, params: {tone: string, style: string, length: string}) {
        const DEV = process.env.DEV
        if (DEV && params){
            const analysis = `Mock analysis response. Description: ${description.substring(0, 30)}...`
            const toneSpec = ` Tone: ${params.tone ?? 'No tone provided.'}`
            const styleSpec = ` Style: ${params.style ?? 'No style provided.'}`
            const lengthSpec = ` Length ${params.length ?? 'No length provided.'}`
            const fullAnalysis = analysis + toneSpec + styleSpec + lengthSpec
            return fullAnalysis
        }
        if (DEV){
            return `Mock analysis response. Description: ${description}`
        }
        const analysis = this.aiService.generateAnalysis(description, params)
        return analysis
    }

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

    public async getAllStats(owner: string, year:number){
        const [
            monthlyTotals, total, thisMonthTotal
        ] = await Promise.all([
            this.statsService.getMonthlyDreamStats(owner, year),
            this.statsService.getTotalNoDreams(owner),
            this.statsService.getDreamsPastMonth(owner)
        ])
        return {monthlyTotals, total, thisMonthTotal}
    }

    public async getDreamAndThemes(dreamId:string){
        const dream = await Dream.findById(dreamId)
        const themes = await this.themeService.getDreamThemes(dreamId)
        return {dream, themes}
    }

    public async getAnalyses(dreamId: string){
        const analyses = await Dream.findById(dreamId).select('analyses')
        return analyses
    }

    public async saveAnalysis(dreamId: string, text: string, tone: Tone, style: Style, length: Length){
        const dream = await Dream.findById(dreamId)
        if (!dream){
            throw new AppError('Dream not found. Invalid id.', 404)
        }
        if (!dream.description){
            // Use 422 status code as request is valid, but cannot be processed due to semantic rules
            throw new AppError('Dream must have a description to save analysis.', 422)
        }
        dream.analyses.push({
            text, tone, style, length, descriptionSnapshot: dream.description
        })
        await dream.save()
        return dream.analyses[dream.analyses.length - 1]
    }

    public async toggleFavorite(dreamId: string, analysisId: string){
        const dream = await Dream.findByIdOrThrowError(dreamId)
        const analysis = dream.analyses.id(analysisId);

        if (!analysis) {
            throw new Error("Analysis not found")
        }
        analysis.isFavorite = !analysis.isFavorite
        await dream.save()
        
        return analysis
    }

    public async deleteAnalysis(dreamId: string, analysisId: string) {
        const result = await Dream.updateOne(
            { _id: dreamId },
            { $pull: { analyses: { _id: analysisId } } }
        );

        if (result.modifiedCount === 0) {
            throw new AppError('Analysis not found or Dream not found', 404);
        }
        return result
    }

    public async updateDreamAndSyncThemes(userId:string, dreamId: string, dreamData: DreamInterface, themes: string[]){
        const normalizedDescription = dreamData.description?.trim() || null
        const existingDream = await Dream.findByIdOrThrowError(dreamId)
        const dream = await Dream.findOneAndUpdate({_id: dreamId}, {...dreamData, description: normalizedDescription}, {new: true})
        
        await this.themeService.removeThemesIfDescriptionRemoved(
            existingDream.description, 
            normalizedDescription, 
            dreamId
        )

        const syncedThemes = normalizedDescription ? await this.themeService.syncThemes(dreamId, themes, userId) :[]
        return {dream, themes: syncedThemes}
    }

    public async deleteDream(dreamId: string, owner: string){
        const dream = await Dream.findOneAndDelete({_id: dreamId, owner})
        return dream
    }  
}