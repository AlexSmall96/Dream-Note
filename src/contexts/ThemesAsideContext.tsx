import { createContext, useState, useContext } from "react";

type ThemesAsideContextType = {
    selectedTheme: string | null
    setSelectedTheme: React.Dispatch<React.SetStateAction<string | null>>
    view: 'themes' | 'dreams'
    setView:  React.Dispatch<React.SetStateAction<'themes' | 'dreams'>>
}

const ThemesAsideContext = createContext<ThemesAsideContextType | null>(null)

export function ThemesAsideProvider ({ children }:{ children: React.ReactNode }) {

    const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
    const [view, setView] = useState<'themes' | 'dreams'>('dreams')
    
    return (
        <ThemesAsideContext.Provider value={{selectedTheme, setSelectedTheme, view, setView}}>
            {children}
        </ThemesAsideContext.Provider>
    )
}

export function useThemesAside(){
    const context = useContext(ThemesAsideContext)

    if (!context){
        throw new Error('useThemesAside must be used within a ThemesAsideProvider')
    }

    return context
}