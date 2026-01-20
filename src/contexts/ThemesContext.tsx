import { fetchThemes } from "@/lib/api/themes"
import { ThemeWithDreamDataResponse } from "@/types/themes"
import { createContext, useContext, useEffect, useState } from 'react'

type ThemesContextType = {
    themes: ThemeWithDreamDataResponse[]
    setThemes: React.Dispatch<React.SetStateAction<ThemeWithDreamDataResponse[]>>
}

const ThemesContext = createContext<ThemesContextType | null>(null)

export function ThemesProvider({ children }:{ children: React.ReactNode }) {
    
    const [themes, setThemes] = useState<ThemeWithDreamDataResponse[]>([])

    useEffect(() => {
        const getThemes = async () => {
            try {
                const response = await fetchThemes()
                setThemes(response.themes)
            } catch (err){
                console.log(err)
            }
        }
        getThemes()
    })

    return (
        <ThemesContext.Provider value={{themes, setThemes}}>
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