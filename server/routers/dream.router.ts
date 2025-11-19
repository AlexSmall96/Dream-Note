import { Router, Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { DreamController } from "../controllers/dream.controlller.js";
import { AuthenticatedRequest } from "../interfaces/auth.interfaces.js";
import { auth } from "../middleware/auth.js";

// Router class for Dream model
@injectable()
export class DreamRouter {
    public router: Router

    // Inject DreamController
    constructor(
        @inject(DreamController) private dreamController: DreamController,
    ){
        this.router = Router();
        this.initializeRoutes();
    }

    // Routes
    private initializeRoutes(){

        // Log new dream
        this.router.post('/log', auth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            try {
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


    }
}