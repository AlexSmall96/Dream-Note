import { Router, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { DreamController } from "../controllers/dream.controlller.js";
import { AuthenticatedRequest } from "../interfaces/auth.interfaces.js";
import { auth } from "../middleware/auth.js";
import { DreamService } from "../services/dream.service.js";

// Router class for Dream model
@injectable()
export class DreamRouter {
    public router: Router

    // Inject DreamController
    constructor(
        @inject(DreamController) private dreamController: DreamController,
        @inject(DreamService) private dreamService: DreamService,
    ){
        this.router = Router();
        this.initializeRoutes();
    }

    // Routes
    private initializeRoutes(){

        // Log new dream
        this.router.post('/log', auth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            try {
                // Title or description must be provided.
                if (!req.body.title && !req.body.description){
                    return res.status(400).json({ error: "At least one of title or description is required." });
                }
                // If title has not been provided, generate title from AI API based on description
                if (!req.body.title){
                    const response = await this.dreamService.generateAIDreamInfo(req.body.description, true)
                    req.body.title = response
                }  
                // If description has been provided, generate themes
                if (req.body.description){
                    const response = await this.dreamService.generateAIDreamInfo(req.body.description, false)
                    console.log(response)
                }
                // If description has not been provided, log dream with title only
                const dream = await this.dreamController.handleLogDream(req.body, req.user._id)
                res.json(dream)
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
                res.json(dream)
            } catch (err){
                next(err)
            }
        })  

        // Update dream
        this.router.patch('/update/:id', auth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            const dreamId = req.params.id
            try {
                const dream = await this.dreamController.handleUpdateDream(req.body, dreamId)
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