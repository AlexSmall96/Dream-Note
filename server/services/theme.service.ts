import { injectable } from "inversify";
import { Theme } from "../models/theme.model";

// Theme sync service for dream update
@injectable()
export class ThemeService {

    public async addTheme(dream: string, text: string){
        const theme = new Theme({theme: text, dream})
        await theme.save()
        return theme
    }

    public async syncThemes(dreamId: string, themeNames: string[]){
        const existingThemes = await Theme.find({ dream: dreamId })

        const incoming = new Set(themeNames)
        const existing = new Set(existingThemes.map(t => t.theme))

        const toAdd = [...incoming].filter(t => !existing.has(t))
        const toRemove = existingThemes.filter(t => !incoming.has(t.theme))

        await Promise.all([
            ...toAdd.map(t => this.addTheme(dreamId, t)),
            ...toRemove.map(t => Theme.deleteOne({ _id: t._id }))
        ])
    }
}