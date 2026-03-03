import { fetchDreamChartStats } from "@/lib/api/dreams";
import { fetchThemeChartStats } from "@/lib/api/themes";
import { last6monthsDreams } from "@/types/dreams";
import { ThemeMonthCount } from "@/types/themes";
import { createContext, useEffect, useState, useContext } from "react";
import { useDreams } from "./DreamsContext";

type StatsContextType = {
    dreamCounts: last6monthsDreams,
    monthlyThemes: ThemeMonthCount[]
    topThemes: string[]
}

const StatsContext = createContext<StatsContextType | null>(null)

export function StatsProvider({ children }:{ children: React.ReactNode }){
    const [dreamCounts, setDreamCounts] = useState<last6monthsDreams>([])
    const [monthlyThemes, setMonthlyThemes] = useState<ThemeMonthCount[]>([])
    const [topThemes, setTopThemes] = useState<string[]>([])

    const { refetch } = useDreams()

    useEffect(() => {
        const getDreamChartStats = async () => {
            const response = await fetchDreamChartStats()
            setDreamCounts(response.dreamCounts)
        } 
        const getThemeChartStats = async () => {
            const response = await fetchThemeChartStats()
            setMonthlyThemes(response.data)
            setTopThemes(response.themes)
        }
        getDreamChartStats() 
        getThemeChartStats() 
    }, [refetch])


    return (
        <StatsContext.Provider value={{dreamCounts, monthlyThemes, topThemes}}>
            {children}
        </StatsContext.Provider>
    )
}

export function useStats(){
    const context = useContext(StatsContext)

    if (!context){
        throw new Error('useStats must be used within a StatsProvider')
    }

    return context
}
