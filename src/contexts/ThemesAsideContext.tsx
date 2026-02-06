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
    setShowDreams: setterFunction<boolean>,
    sort: boolean,
    setSort: setterFunction<boolean>
    search: string,
    setSearch: setterFunction<string>,
    chronView: boolean ,
    setChronView: setterFunction<boolean>
}

const ThemesAsideContext = createContext<ThemesAsideContextType | null>(null)

export function ThemesAsideProvider ({ children }:{ children: React.ReactNode }) {
    const now = new Date()
    const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
    const [view, setView] = useState<'themes' | 'dreams'>('dreams')
    const [month, setMonth] = useState<MonthLabel>(
        now.toLocaleString('default', { month: 'short' }) as MonthLabel
    )
    const [year, setYear] = useState(now.getFullYear())
    const [showDreams, setShowDreams] = useState(true)
    const [sort, setSort] = useState(false)
    const [search, setSearch] = useState('')
    const [chronView, setChronView] = useState(false)

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
            setShowDreams,
            sort,
            setSort,
            search,
            setSearch,
            chronView,
            setChronView
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