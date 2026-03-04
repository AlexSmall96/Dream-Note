import { fetchThemeChartStats } from "@/lib/api/themes";
import { ThemeMonthCount } from "@/types/themes";
import { createContext, useEffect, useState, useContext } from "react";
import { useDreams } from "./DreamsContext";

type ThemeChartContextType = {
    monthlyThemes: ThemeMonthCount[]
    topThemes: string[]
}

const ThemeChartContext = createContext<ThemeChartContextType | null>(null)

export function ThemeChartProvider({ children }:{ children: React.ReactNode }){
    const [monthlyThemes, setMonthlyThemes] = useState<ThemeMonthCount[]>([])
    const [topThemes, setTopThemes] = useState<string[]>([])

    const { refetch } = useDreams()

    useEffect(() => {
        const getThemeChartStats = async () => {
            const response = await fetchThemeChartStats()
            setMonthlyThemes(response.data)
            setTopThemes(response.themes)
        }
        getThemeChartStats() 
    }, [refetch])


    return (
        <ThemeChartContext.Provider value={{monthlyThemes, topThemes}}>
            {children}
        </ThemeChartContext.Provider>
    )
}

export function useThemeChart(){
    const context = useContext(ThemeChartContext)

    if (!context){
        throw new Error('useThemeChart must be used within a ThemeChartProvider')
    }

    return context
}
