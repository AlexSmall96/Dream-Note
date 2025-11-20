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
                const themes = await this.themeController.handleGetAllThemes(req.user._id)
                res.json(themes)
            } catch (err){
                next(err)
            }
        })

        // Remove a theme
        this.router.delete('/delete/:id', auth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            const themeId = req.params.id
            try {
                const theme = this.themeController.handleRemoveTheme(themeId)
                res.json(theme)
            } catch (err){
                next(err)
            }
        })

        // Add theme and get themes associated with a specific dream are handled in dream.router.ts
    }
}