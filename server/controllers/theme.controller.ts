import { injectable, inject } from "inversify";
import { Theme } from "../models/theme.model.js";
import { Dream } from "../models/dream.model.js";
import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../interfaces/auth.interfaces.js";
import { ThemeService } from "../services/themes/theme.service.js";

// Controller clas for Theme model
@injectable()
export class ThemeController {

    constructor(
        @inject(ThemeService) private themeService: ThemeService
    ){

    }
    public getAllThemes = async (req: Request, res: Response, next: NextFunction) => {
        const authReq = req as AuthenticatedRequest
        const userId = authReq.user._id.toString()
        try {
            // Get limit and skip parameters
            const limit = req.query.limit? Number(req.query.limit) : 100
            const skip = req.query.skip? Number(req.query.skip) : 0
            const sort = req.query.sort === 'theme' ? 'theme' : 'createdAt'
            const themes = await this.themeService.getAllThemes(userId, limit, skip, sort)
            res.json({themes})
        } catch (err){
            next(err)
        }
    }

    public deleteTheme = async (req: Request, res: Response, next: NextFunction) => {
            const themeId = req.params.id
            try {
                const theme = await this.themeService.deleteTheme(themeId)
                res.json(theme)
            } catch (err){
                next(err)
            }        
    }


    // Remove a theme
    public async handleRemoveTheme(themeId: string, userId: string){
        const dreamIds = await Dream.find({ owner: userId }).distinct('_id');
        const theme = await Theme.findOneAndDelete({_id:themeId, dream: { $in: dreamIds }})
        return theme
    }
}
