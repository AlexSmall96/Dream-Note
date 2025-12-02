import { Router, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { ThemeController } from "../controllers/theme.controller.js"
import { AuthenticatedRequest } from "../interfaces/auth.interfaces.js";
import { auth } from "../middleware/auth.js";

// Router class for Dream model
@injectable()
export class ThemeRouter {
    public router: Router

    constructor(
        @inject(ThemeController) private themeController: ThemeController
    ){
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(){

        // Get all users themes
        this.router.get('/', auth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            try {
                // Get limit and skip parameters
                const limit = req.query.limit? Number(req.query.limit) : 100
                const skip = req.query.skip? Number(req.query.skip) : 0
                const sort = req.query.sort?.toString()
                const themes = await this.themeController.handleGetAllThemes(req.user._id, limit, skip, sort)
                res.json(themes)
            } catch (err){
                next(err)
            }
        })

        // Remove a theme
        this.router.delete('/delete/:id', auth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            const themeId = req.params.id
            const userId = req.user._id
            try {
                const theme = await this.themeController.handleRemoveTheme(themeId, userId)
                if (!theme){
                    return res.status(401).json({error: 'You are not authorized to delete this theme.'})
                }
                res.json(theme)
            } catch (err){
                next(err)
            }
        })

        // Add theme and get themes associated with a specific dream are handled in dream.router.ts
    }
}