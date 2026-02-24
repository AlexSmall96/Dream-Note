import { injectable, inject } from "inversify";
import { GetDreamsQuery } from "../interfaces/dream.interfaces.js"
import { DreamService } from "../services/dreams/dream.service.js";
import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../interfaces/auth.interfaces.js";
import { getStartAndEndDates, getYearRange } from "../services/utils/dateRange.js";

// Controller clas for Dream model
@injectable()
export class DreamController {
    constructor(
        @inject(DreamService) private dreamService: DreamService,
    ){}

    public logNewDreamWithThemes = async (req: Request, res:Response, next: NextFunction) => {
        const dreamData = req.body.dream
        const incomingThemes = req.body.themes ?? null
        const authReq = req as AuthenticatedRequest
        const userId = authReq.user._id.toString()
        try {
            const {dream, themes} = await this.dreamService.logNewDreamWithThemes(dreamData, incomingThemes, userId)
            res.status(201).json(themes ? {dream, themes} : {dream})
        } catch (err){
            next(err)
        }
    }

    public getAiAnalysis = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Get tone and style from request
            const params = req.body.params ?? null
            const description = req.body.description
            // Create full prompt using tone and style
            const analysis = await this.dreamService.getAiAnalysis(description, params)
            res.json({analysis: analysis ?? ''})
        } catch (err){
            next(err)
        }
    }

    private parseDreamQuery = (query: GetDreamsQuery) => {
        const title = query.title? new RegExp(query.title.toString().trim(), "i") : new RegExp('')
        // Get year and month query parameters
        const year = query.year? Number(query.year) : undefined 
        const month = query.month? Number(query.month) : undefined
        const NOW = new Date()
        // If month and year are supplied calculate date range, otherwise take all time
        const [startDate, endDate] = year && month ? getStartAndEndDates(year, month) : getYearRange(NOW.getFullYear())
        // Get limit and skip parameters
        const limit = query.limit? Number(query.limit) : 100
        const skip = query.skip? Number(query.skip) : 0
        const sort = query.sort === 'true'
        return {
            title, limit, skip, sort, startDate, endDate
        }
    }


    public getAllDreams = async (req: Request<{}, {}, GetDreamsQuery>, res: Response, next: NextFunction) => {
        const authReq = req as AuthenticatedRequest
        const userId = authReq.user._id.toString()
        // Get title query parameter
        const query = authReq.query
        const {
            title, limit, skip, sort, startDate, endDate
        } = this.parseDreamQuery(query)
        try {
            const { dreams, monthlyTotals } = await this.dreamService.getDreamsWithStats(userId, { title, startDate, endDate, limit, skip, sort })
            res.json({dreams, monthlyTotals})
        } catch (err){
            next(err)
        }
    }

    public viewDream = async (req: Request, res: Response, next: NextFunction) => {
        const dreamId = req.params.id
        try {
            const {dream, themes} = await this.dreamService.getDreamAndThemes(dreamId)
            res.json({dream, themes})
        } catch (err){
            next(err)
        }
    }

    public getAnalyses = async (req: Request, res: Response, next: NextFunction) => {
        const dreamId = req.params.id
        try {
            const analyses = await this.dreamService.getAnalyses(dreamId)
            res.json(analyses)
        } catch (err){
            next(err)
        }
    }

    public saveAnalysis = async (req: Request, res: Response, next: NextFunction) => {
        const dreamId = req.params.id
        const { text, tone, style, length } = req.body
        try {
            const analysis = await this.dreamService.saveAnalysis(dreamId, text, tone, style, length)
            res.status(201).json(analysis)
        } catch (err){
            next(err)
        }
    }

    public updateDream = async (req: Request, res: Response, next: NextFunction) => {
        const dreamId = req.params.id
        const dreamData = req.body.dream
        const incomingThemes = req.body.themes
        const authReq = req as AuthenticatedRequest
        const userId = authReq.user._id.toString()
        try {
            const {dream, themes} = await this.dreamService.updateDreamAndSyncThemes(userId, dreamId, dreamData, incomingThemes)
            return res.json({dream, themes})
        } catch (err){
            next(err)
        }
    }

    public deleteDream = async (req: Request, res: Response, next: NextFunction) => {
        const authReq = req as AuthenticatedRequest
        const dreamId = req.params.id
        const owner = authReq.user._id.toString()
        try {
            const dream = await this.dreamService.deleteDream(dreamId, owner)
            res.json(dream)
        } catch (err){
            next(err)
        }          
    }

}