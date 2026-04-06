import { createContext, useState, useContext, useEffect } from "react";
import { setterFunction } from "@/types/setterFunctions";
import { MonthLabel } from "@/lib/filters/dateRanges";

type ThemesAsideContextType = {
    selectedTheme: string | null
    setSelectedTheme: setterFunction<string | null>
    view: 'themes' | 'dreams'
    setView:  setterFunction<'themes' | 'dreams'>
    month: MonthLabel
    setMonth: setterFunction<MonthLabel>,
    monthString: string,
    setMonthString: setterFunction<string>,
    year: string,
    setYear: setterFunction<string>,
    showDreams: boolean, 
    setShowDreams: setterFunction<boolean>,
    sort: boolean,
    setSort: setterFunction<boolean>
    search: string,
    setSearch: setterFunction<string>,
    chronView: boolean ,
    setChronView: setterFunction<boolean>,
    isOpen: boolean,
    setIsOpen: setterFunction<boolean>
}

const ThemesAsideContext = createContext<ThemesAsideContextType | null>(null)

export function ThemesAsideProvider ({ children }:{ children: React.ReactNode }) {
    const now = new Date()
    const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
    const [view, setView] = useState<'themes' | 'dreams'>('dreams')
    const [month, setMonth] = useState<MonthLabel>(
        now.toLocaleString('default', { month: 'short' }) as MonthLabel
    )
    const [monthString, setMonthString] = useState<string>('')

    useEffect(() => {
        const month = monthString.split(' ')[0] as MonthLabel
        setMonth(month)
    }, [monthString])
    
    const [year, setYear] = useState<string>(now.getFullYear().toString())
    const [showDreams, setShowDreams] = useState(true)
    const [sort, setSort] = useState(false)
    const [search, setSearch] = useState('')
    const [chronView, setChronView] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    return (
        <ThemesAsideContext.Provider value={{
            selectedTheme, 
            setSelectedTheme, 
            view, 
            setView, 
            month, 
            setMonth, 
            monthString,
            setMonthString,
            year, 
            setYear, 
            showDreams, 
            setShowDreams,
            sort,
            setSort,
            search,
            setSearch,
            chronView,
            setChronView,
            isOpen,
            setIsOpen
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