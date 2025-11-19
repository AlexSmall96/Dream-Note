import { Router, Request, Response, NextFunction } from "express";
import { DreamController } from "../controllers/dream.controlller";
import { injectable, inject } from "inversify";
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
        this.router.post('/log', auth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            try {
                const dream = await this.dreamController.handleLogDream(req.body, req.user._id)
                res.json(dream)
            } catch (err){
                next(err)
            }
        })
    }
}