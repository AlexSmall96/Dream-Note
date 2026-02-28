import { injectable, inject } from "inversify";
import { Theme } from "../../models/theme.model.js";
import { CountsService } from "./counts.service.js";

@injectable()
export class ThemeService {
    constructor(
        @inject(CountsService) private countsService: CountsService
    ){}


    public async getAllThemesWithCounts(userId: string, limit: number, skip: number, sort: 'theme' | 'createdAt'){
        const themes = await Theme.find({ owner: userId}).populate({
            path: "dream",
            select: "_id title date"
        }).sort(sort === 'theme' ? {'theme': 1}: {'createdAt': -1}).skip(skip).limit(limit)
        const counts = await this.countsService.getThemeCounts(userId)
        return {themes, counts}
    }

    public async getThemeSuggestions(userId: string, search: RegExp) {
        const themes = await Theme.distinct("theme", {
            owner: userId,
            theme: { $regex: search }
        })

        return themes.slice(0, 7)
    }

    public async deleteTheme(themeId: string){
        const theme = await Theme.findByIdAndDelete(themeId)
        return theme
    }

    // Get all themes associated with a specific dream
    public async getDreamThemes(dream: string){
        const themes = Theme.find({dream}).sort('theme')
        return themes
    }

    public async addTheme(dream: string, text: string, userId: string){
        const theme = new Theme({theme: text, dream, owner: userId})
        await theme.save()
        return theme
    }

    async addThemesToDream(dreamId: string, themes: string[], userId: string): Promise<string[]> {
        // Add each theme to database
        await Promise.all(
            themes.map(async (text: string) => {
                await this.addTheme(dreamId, text.trim(), userId)
            })
        )
        return themes
    }

    public async removeAllForDream(dreamId: string){
        await Theme.deleteMany({dream: dreamId})
    }

    public async syncThemes(dreamId: string, themeNames: string[], userId:string){
        const existingThemes = await Theme.find({ dream: dreamId })

        const incoming = new Set(themeNames)
        const existing = new Set(existingThemes.map(t => t.theme))

        const toAdd = [...incoming].filter(t => !existing.has(t))
        const toRemove = existingThemes.filter(t => !incoming.has(t.theme))

        await Promise.all([
            ...toAdd.map(t => this.addTheme(dreamId, t, userId)),
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