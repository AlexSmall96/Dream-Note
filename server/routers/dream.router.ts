import { Router } from "express";
import { injectable, inject } from "inversify";
import { DreamController } from "../controllers/dream.controlller.js";
import { ThemeController } from "../controllers/theme.controller.js"
import { auth } from "../middleware/users/auth.js";
import { DreamService } from "../services/dreams/dream.service.js";
import { ThemeService } from "../services/themes/theme.service.js";
import { body } from "express-validator";
import { requireTitleOrDescription } from "../middleware/dreams/requireTitleOrDescription.js";
import { requireDescriptionForThemes } from "../middleware/dreams/requireDescriptionForThemes.js";
import { forbidNotDreamOwner } from "../middleware/dreams/forbidNotDreamOwner.js";
import { validateRequest } from "../middleware/validateRequest.js";

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
        this.router.post(
            '/log',
            auth,
            requireTitleOrDescription,
            requireDescriptionForThemes,
            this.dreamController.logNewDreamWithThemes
        )
        
        // Get AI analysis
        this.router.post(
            '/analysis',
            auth,
            body('description')
            .notEmpty().withMessage('Description must be provided.'),
            validateRequest,
            this.dreamController.getAiAnalysis
        )

        // Get all dreams
        this.router.get(
            '/',
            auth,
            this.dreamController.getAllDreams
        )

        // View a single dream
        this.router.get(
            '/view/:id',
            auth,
            forbidNotDreamOwner('You are not authorized to view this dream.'),
            this.dreamController.viewDream
        )

        // Get analyses for a single dream
        this.router.get(
            '/:id/analyses',
            auth,
            forbidNotDreamOwner('You are not authorized to view analyses for this dream.'),
            this.dreamController.getAnalyses
        )

        // Delete analysis
        this.router.delete(
            '/delete/:dreamId/analyses/:analysisId',
            auth,
            forbidNotDreamOwner('You are not authorized to delete this analysis.'),
            this.dreamController.deleteAnalysis
        )


        this.router.post(
            '/:id/analysis',
            auth,
            forbidNotDreamOwner('You are not authorized to add analyses to this dream.'),
            body('tone')
            .notEmpty().withMessage("Request body must contain the field 'tone'").bail(),
            body('style')
            .notEmpty().withMessage("Request body must contain the field 'style'").bail(),
            body('length')
            .notEmpty().withMessage("Request body must contain the field 'length'"),
            validateRequest,
            this.dreamController.saveAnalysis
        )

        // Update dream
        this.router.patch(
            '/update/:id',
            auth,
            forbidNotDreamOwner('You are not authorized to edit this dream.'),
            body('dream')
            .notEmpty().withMessage("Request body must contain the field 'dream'.").bail(),
            validateRequest,
            body('dream.title')
            .notEmpty().withMessage('Dream data must contain title.'),
            validateRequest,
            this.dreamController.updateDream
        )

        // Delete dream
        this.router.delete(
            '/delete/:id', 
            auth,
            // Guests can delete dreams as data resets on login, but users cannot delete dreams they are not owner of
            forbidNotDreamOwner('You are not authorized to delete this dream.'),
            this.dreamController.deleteDream
        )
    }
}