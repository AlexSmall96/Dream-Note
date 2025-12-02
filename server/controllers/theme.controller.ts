import { injectable } from "inversify";
import { Theme } from "../models/theme.model.js";
import { Dream } from "../models/dream.model.js";

// Controller clas for Theme model
@injectable()
export class ThemeController {

    // Add themes to dream
    public async handleAddTheme(dream: string, text: string){
        const theme = new Theme({theme: text, dream})
        await theme.save()
        return theme
    }

    // Get all themes associated with a specific dream
    public async handleGetDreamThemes(dream: string){
        const themes = Theme.find({dream}).sort('theme')
        return themes
    }

    // Get all a users themes
    public async handleGetAllThemes(userId: string, limit: number, skip: number, sort?: string) {
        const dreamIds = await Dream.find({ owner: userId }).distinct('_id');
        const themes = await Theme.find({ 
            dream: { $in: dreamIds } 
        }).populate({
            path: "dream",
            select: "_id title date"
        }).sort(sort? 'theme': {'createdAt': -1}).skip(skip).limit(limit)
        return themes
    }   

    // Remove a theme
    public async handleRemoveTheme(themeId: string){
        const theme = await Theme.findByIdAndDelete(themeId)
        return theme
    }
}
