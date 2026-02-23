import { Router } from "express";
import { injectable, inject } from "inversify";
import { ThemeController } from "../controllers/theme.controller.js"
import { auth } from "../middleware/users/auth.js";
import { forbidNotThemeOwner } from "../middleware/themes/forbidNotThemeOwner.js";

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
        this.router.get('/', auth, this.themeController.getAllThemes)
        
        // Remove a theme
        this.router.delete(
            '/delete/:id',  
            auth,
            forbidNotThemeOwner,
            this.themeController.deleteTheme
        )

        // Add theme and get themes associated with a specific dream are handled in dream.router.ts
    }
}