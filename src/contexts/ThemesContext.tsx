import { fetchThemes } from "@/lib/api/themes"
import { setterFunction } from "@/types/setterFunctions"
import { ThemeWithDreamDataResponse, ThemeCounts } from "@/types/themes"
import { createContext, useContext, useEffect, useState } from 'react'

type ThemesContextType = {
    themes: ThemeWithDreamDataResponse[]
    setThemes: setterFunction<ThemeWithDreamDataResponse[]>
    counts: ThemeCounts,
    setCounts: setterFunction<ThemeCounts>
}

const ThemesContext = createContext<ThemesContextType | null>(null)

export function ThemesProvider({ children }:{ children: React.ReactNode }) {
    
    const [themes, setThemes] = useState<ThemeWithDreamDataResponse[]>([])
    const [counts, setCounts] = useState<ThemeCounts>({})

    useEffect(() => {
        const getThemes = async () => {
            try {
                const response = await fetchThemes()
                setThemes(response.themes)
                setCounts(response.counts)
            } catch (err){
                console.log(err)
            }
        }
        getThemes()
    }, [])

    return (
        <ThemesContext.Provider value={{themes, setThemes, counts, setCounts}}>
            {children}
        </ThemesContext.Provider>
    )
}

export function useThemes(){
    const context = useContext(ThemesContext)

    if (!context){
        throw new Error('useThemes must be used within a DreamsProvider')
    }

    return context
}