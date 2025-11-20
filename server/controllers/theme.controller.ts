import { injectable } from "inversify";
import { ThemeInterface } from "../interfaces/theme.interfaces.js";
import { Theme } from "../models/theme.model.js";

// Controller clas for Theme model
@injectable()
export class ThemeController {

    // Add themes to dream
    public async handleAddTheme(dream: string, text: string){
        const theme = new Theme({theme: text, dream})
        await theme.save()
        return theme
    }
}
