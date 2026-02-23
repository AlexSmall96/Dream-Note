import { injectable } from "inversify";
import { Theme } from "../../models/theme.model.js";

@injectable()
export class ThemeService {

    // Get all themes associated with a specific dream
    public async handleGetDreamThemes(dream: string){
        const themes = Theme.find({dream}).sort('theme')
        return themes
    }

    public async addTheme(dream: string, text: string){
        const theme = new Theme({theme: text, dream})
        await theme.save()
        return theme
    }

    async addThemesToDream(dreamId: string, themes: string[]): Promise<string[]> {
        // Add each theme to database
        await Promise.all(
            themes.map(async (text: string) => {
                await this.addTheme(dreamId, text.trim())
            })
        )
        return themes
    }

    public async removeAllForDream(dreamId: string){
        await Theme.deleteMany({dream: dreamId})
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

        const syncedThemes = await Theme.find({ dream: dreamId })
        return syncedThemes
    }

    public async removeThemesIfDescriptionRemoved(
        oldDescription: string | null,
        newDescription: string | null,
        dreamId: string
    ): Promise<boolean> {
        if (oldDescription && !newDescription) {
            await this.removeAllForDream(dreamId)
            return true
        }
        return false
    }
}