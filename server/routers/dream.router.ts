import { Router, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { DreamController } from "../controllers/dream.controlller.js";
import { ThemeController } from "../controllers/theme.controller.js"
import { AuthenticatedRequest } from "../interfaces/auth.interfaces.js";
import { auth } from "../middleware/auth.js";
import { DreamService } from "../services/dream.service.js";
import { ThemeService } from "../services/theme.service.js";
import { prompts } from "../services/dream.service.js"
import { Dream } from "../models/dream.model.js";
import { getStartAndEndDates } from "../services/utils/dateRange.js";
import { formatError } from "../utils/formatError.js";

// Router class for Dream model
@injectable()
export class DreamRouter {
    public router: Router
    
    // Inject DreamController, DreamService and ThemeController
    constructor(
        @inject(DreamController) private dreamController: DreamController,
        @inject(DreamService) private dreamService: DreamService,
        @inject(ThemeService) private themeService: ThemeService,
        @inject(ThemeController) private themeController: ThemeController
    ){
        this.router = Router();
        this.initializeRoutes();
    }

    // Routes
    private initializeRoutes(){

        // Log new dream
        this.router.post('/log', auth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            try {
                const dreamData = req.body.dream
                // Title or description must be provided.
                if (!dreamData.title && !dreamData.description){
                    return res.status(400).json(formatError('At least one of title or description is required.'))
                }
                // If title has not been provided, generate title from AI API based on description
                if (!dreamData.title){
                    const title = await this.dreamService.generateAIDreamInfo(dreamData.description, prompts.title, false) as string
                    // If API not working, make title first 15 characters of description
                    dreamData.title = title ?? dreamData.description.substring(0, 15).concat('...')
                }  
                // Dream now has title and optional description
                const dream = await this.dreamController.handleLogDream(dreamData, req.user._id)
                // If description has been provided, generate or save themes
                const incomingThemes = req.body.themes
                if (dreamData.description){
                    const themes = await this.dreamService.addThemesToDream(dreamData.description, dream.id, incomingThemes)
                    // Return dream document and themes array
                    return res.status(201).json({dream, themes})
                }
                if (!dreamData.description && incomingThemes.length > 0){
                    return res.status(400).json(formatError('Cannot add themes to dream with no description.', 'description'))
                }
                // Return dream document
                res.status(201).json({dream})
            } catch (err){
                next(err)
            }
        })


        // Get AI analysis based on description
        this.router.post('/analysis', auth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            try {
                if (!req.body.description){
                    return res.status(400).json(formatError('Description must be provided.', 'description'))
                }
                // Get tone and style from request
                const tone = req.body.tone ?? ''
                const style = req.body.style ?? ''
                // Create full prompt using tone and style
                const analysis = await this.dreamService.generateAIDreamInfo(req.body.description, prompts.analysis, false, {tone, style}) as string
                res.json({analysis: analysis ?? ''})
            } catch (err){
                next(err)
            }
        })  


        // Get a users dreams
        // Can view all dreams, search by title or filter by date
        this.router.get('/', auth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            // Get title query parameter
            const title = req.query.title? new RegExp(req.query.title.toString().trim(), "i") : new RegExp('')
            // Get year and month query parameters
            const query = req.query
            const year = query.year? Number(query.year) : undefined 
            const month = query.month? Number(query.month) : undefined
            const NOW = new Date()
            // If month and year are supplied calculate date range, otherwise take all time
            const [startDate, endDate] = year && month ? getStartAndEndDates(year, month) : [new Date("1900-01-01"), NOW]
            // Get limit and skip parameters
            const limit = query.limit? Number(req.query.limit) : 100
            const skip = query.skip? Number(req.query.skip) : 0
            const sort = query.sort === 'true' || false
            try {
                const { dreams, monthlyTotals } = await this.dreamService.getDreamsWithStats({owner: req.user._id, title, startDate, endDate, limit, skip, sort})
                res.json({dreams, monthlyTotals})
            } catch (err){
                next(err)
            }
        })

        // View details for a single dream
        this.router.get('/view/:id', auth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            const dreamId = req.params.id
            const owner = req.user._id
            try {
                const dream = await this.dreamController.handleViewDream(dreamId, owner)
                if (!dream){
                    return res.status(403).json(formatError('You are not authorized to view this dream.'))
                }
                const themes = await this.themeController.handleGetDreamThemes(dreamId)
                res.json({dream, themes})
            } catch (err){
                next(err)
            }
        })  

        // Update dream
        this.router.patch('/update/:id', auth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            const dreamId = req.params.id
            const dreamData = req.body.dream
            const themes = req.body.themes
            if (!dreamData){
                return res.status(400).json(formatError("Request body must contain the field 'dream'.", 'dream'))
            }
            if (!dreamData.title || dreamData.title.trim() === "") {
                return res.status(400).json(formatError('Dream data must contain title.', 'title'))
            }
            try {
                const existingDream = await Dream.findByIdOrThrowError(dreamId)
                const normalizedDescription = dreamData.description?.trim() || null
                // Save dream
                const dream = await this.dreamController.handleUpdateDream({...dreamData, description: normalizedDescription}, dreamId, req.user._id)
                if (!dream){
                    return res.status(403).json(formatError('You are not authorized to edit this dream.'))
                }
                // Check if themes should be deleted
                await this.dreamService.removeThemesIfDescriptionRemoved(
                    existingDream.description, 
                    normalizedDescription, 
                    dreamId
                )
                // Sync themes
                const syncedThemes = normalizedDescription ? await this.themeService.syncThemes(dreamId, themes) :[]
                return res.json({dream, themes: syncedThemes})
            } catch (err){
                next(err)
            }
        })

        // Delete dream
        this.router.delete('/delete/:id', auth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            const dreamId = req.params.id
            const owner = req.user._id
            try {
                const dream = await this.dreamController.handleDeleteDream(dreamId, owner)
                if (!dream){
                    return res.status(403).json(formatError('You are not authorized to delete this dream.'))
                }
                res.json(dream)
            } catch (err){
                next(err)
            }            
        })


    }
}