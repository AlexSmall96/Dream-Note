import { fetchChartStats } from "@/lib/api/dreams";
import { last6monthsDreams } from "@/types/dreams";
import { setterFunction } from "@/types/setterFunctions";
import { createContext, useEffect, useState, useContext } from "react";

type StatsContextType = {
    dreamCounts: last6monthsDreams,
    setDreamCounts: setterFunction<last6monthsDreams>
}

const StatsContext = createContext<StatsContextType | null>(null)

export function StatsProvider({ children }:{ children: React.ReactNode }){
    const [dreamCounts, setDreamCounts] = useState<last6monthsDreams>([])

    useEffect(() => {
        const getChartStats = async () => {
            const response = await fetchChartStats()
            setDreamCounts(response.dreamCounts)
            console.log(response.dreamCounts)
        } 
        getChartStats() 
    }, [])


    return (
        <StatsContext.Provider value={{dreamCounts, setDreamCounts}}>
            {children}
        </StatsContext.Provider>
    )
}

export function useStats(){
    const context = useContext(StatsContext)

    if (!context){
        throw new Error('useDreams must be used within a DreamsProvider')
    }

    return context
}
