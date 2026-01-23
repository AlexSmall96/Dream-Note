import { createContext, useState, useContext } from "react";
import { setterFunction } from "@/types/setterFunctions";
import { MonthLabel } from "@/lib/filters/dateRanges";

type ThemesAsideContextType = {
    selectedTheme: string | null
    setSelectedTheme: setterFunction<string | null>
    view: 'themes' | 'dreams'
    setView:  setterFunction<'themes' | 'dreams'>
    month: MonthLabel
    setMonth: setterFunction<MonthLabel>
    year: number,
    setYear: setterFunction<number>,
    showDreams: boolean, 
    setShowDreams: setterFunction<boolean>
}

const ThemesAsideContext = createContext<ThemesAsideContextType | null>(null)

export function ThemesAsideProvider ({ children }:{ children: React.ReactNode }) {

    const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
    const [view, setView] = useState<'themes' | 'dreams'>('dreams')
    const [month, setMonth] = useState<MonthLabel>('Jan') // make current month
    const [year, setYear] = useState(2026)
    const [showDreams, setShowDreams] = useState(true)
    return (
        <ThemesAsideContext.Provider value={{
            selectedTheme, 
            setSelectedTheme, 
            view, 
            setView, 
            month, 
            setMonth, 
            year, 
            setYear, 
            showDreams, 
            setShowDreams
        }}>
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