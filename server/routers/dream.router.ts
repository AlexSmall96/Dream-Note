import { Router, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { DreamController } from "../controllers/dream.controlller.js";
import { ThemeController } from "../controllers/theme.controller.js"
import { AuthenticatedRequest } from "../interfaces/auth.interfaces.js";
import { auth } from "../middleware/auth.js";
import { DreamService } from "../services/dream.service.js";

// Prompts for openAI API
enum prompts {
    title = 'Return exactly one short title for the provided dream.',
    themes =  'Return 1-4 one word themes for the provided dream. Seperate them by commas without spaces.',
    analysis = `Return a short interpretation of the provided dream. Include only the interpretation itself without any \n.
                Never use self referntial langugae and never include a follow up question.`
}
              
// Router class for Dream model
@injectable()
export class DreamRouter {
    public router: Router
    public addThemes: (description: string, dreamId: string, existingThemes: string[] | null) => Promise<string[]>
    
    // Inject DreamController, DreamService and ThemeController
    constructor(
        @inject(DreamController) private dreamController: DreamController,
        @inject(DreamService) private dreamService: DreamService,
        @inject(ThemeController) private themeController: ThemeController
    ){
        this.router = Router();
        this.initializeRoutes();

        // Add themes method used by log new dream and update dream routes
        this.addThemes = async (description, dreamId, existingThemes) => {
            // Use existing themes or generate themes if null
            const themes = existingThemes ?? await this.dreamService.generateAIDreamInfo(description, prompts.themes, true) as string[]
            // Add each theme to database
            themes.forEach(async (text: string) => {
                await this.themeController.handleAddTheme(dreamId, text.trim())
            })
            return themes
        }
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
                if (dreamData.description){
                    const themes = await this.addThemes(dreamData.description, dream.id, req.body.themes)
                    // Return dream document and themes array
                    return res.json({dream, themes})
                }

                // Return dream document
                res.json({dream})
            } catch (err){
                next(err)
            }
        })


        // Get AI analysis based on description
        this.router.get('/analysis', auth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            try {
                // Get tone and style from request
                const tone = req.body.tone
                const style = req.body.style
                // Create full prompt using tone and style
                const fullPrompt = prompts.analysis.concat(` ${tone}`).concat(` ${style}`)
                const analysis = await this.dreamService.generateAIDreamInfo(req.body.dream.description, fullPrompt, false) as string
                res.json(analysis ?? '')
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
                res.json(dreams)
            } catch (err){
                next(err)
            }
        })

        // View details for a single dream
        this.router.get('/view/:id', auth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            const dreamId = req.params.id
            try {
                const dream = await this.dreamController.handleViewDream(dreamId)
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
            try {
                // Save dream
                const dream = await this.dreamController.handleUpdateDream(dreamData, dreamId)

                // Check if dream has any themes in database
                const savedThemes = await this.themeController.handleGetDreamThemes(dreamId)

                // If description exists but there are no saved themes, generate themes
                if (dream.description && !savedThemes.length){
                    const themes = await this.addThemes(dream.description, dreamId, null)
                    // Return dream document and themes array
                    return res.json({dream, themes})
                }
                res.json(dream)
            } catch (err){
                next(err)
            }
        })

        // Delete dream
        this.router.delete('/delete/:id', auth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            const dreamId = req.params.id
            try {
                const dream = await this.dreamController.handleDeleteDream(dreamId)
                res.json(dream)
            } catch (err){
                next(err)
            }            
        })


    }
}