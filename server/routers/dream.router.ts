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
                    return res.status(400).json({ error: "At least one of title or description is required." });
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
                    throw new Error('Description must be provided to add themes.')
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
                    return res.status(400).json({ error: "Description must be provided." });
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
            // Get daysAgo query parameter and construct start date to take documents from
            const fromDate = req.query.daysAgo ? 
                new Date(Date.now() - Number(req.query.daysAgo) * 24 * 60 * 60 * 1000)
            :
                new Date("1970-01-01")
            // Get limit and skip parameters
            const limit = req.query.limit? Number(req.query.limit) : 100
            const skip = req.query.skip? Number(req.query.skip) : 0
            try {
                const dreams = await this.dreamController.handleGetDreams(req.user._id, title, fromDate, limit, skip)
                res.json({dreams})
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
                    return res.status(401).json({error: 'You are not authorized to view this dream.'})
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
                return res.status(400).json({ error: "Request body must contain the field 'dream'." })
            }
            if (!dreamData.title || dreamData.title.trim() === "") {
                return res.status(400).json({ error: "Dream data must contain title." });
            }
            try {
                const existingDream = await Dream.findByIdOrThrowError(dreamId)
                const normalizedDescription = dreamData.description?.trim() || null
                // Save dream
                const dream = await this.dreamController.handleUpdateDream({...dreamData, description: normalizedDescription}, dreamId, req.user._id)
                if (!dream){
                    return res.status(401).json({error: 'You are not authorized to edit this dream.'})
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
                    return res.status(401).json({error: 'You are not authorized to delete this dream.'})
                }
                res.json(dream)
            } catch (err){
                next(err)
            }            
        })


    }
}