import { ThemeWithDreamDataResponse } from "@/types/themes";

export const getUniqueThemes = (themes: ThemeWithDreamDataResponse[]):string[] => {
    const themesSet = new Set(themes.map(t => t.theme))
    return Array.from(themesSet)
} 