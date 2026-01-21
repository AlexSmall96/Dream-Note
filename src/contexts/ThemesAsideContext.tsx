import { createContext, useState, useContext } from "react";
import { setterFunction } from "@/types/setterFunctions";
import { optionKeys } from "@/lib/api/dreams";

type ThemesAsideContextType = {
    selectedTheme: string | null
    setSelectedTheme: setterFunction<string | null>
    view: 'themes' | 'dreams'
    setView:  setterFunction<'themes' | 'dreams'>,
    from: string,
    setFrom: setterFunction<string>
}

const ThemesAsideContext = createContext<ThemesAsideContextType | null>(null)

export function ThemesAsideProvider ({ children }:{ children: React.ReactNode }) {

    const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
    const [view, setView] = useState<'themes' | 'dreams'>('dreams')
    const [from, setFrom] = useState<string>(optionKeys[0])

    return (
        <ThemesAsideContext.Provider value={{selectedTheme, setSelectedTheme, view, setView, from, setFrom}}>
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