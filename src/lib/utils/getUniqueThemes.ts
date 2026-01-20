import { ThemeWithDreamDataResponse } from "@/types/themes";

export const getUniqueThemes = (themes: ThemeWithDreamDataResponse[]):string[] => {
    const uniqueSet = themes.reduce((uniques:Set<string> , theme: ThemeWithDreamDataResponse) => {
        if (!uniques.has(theme.theme)){
            uniques.add(theme.theme)
        }
        return uniques
    }, new Set())
    return Array.from(uniqueSet)
} 