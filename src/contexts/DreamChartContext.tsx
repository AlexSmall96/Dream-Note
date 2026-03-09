import { fetchDreamChartStats } from "@/lib/api/dreams";
import { DreamCounts } from "@/types/dreams";
import { createContext, useEffect, useState, useContext } from "react";
import { useDreams } from "./DreamsContext";

type DreamChartContextType = {
    dreamCounts: DreamCounts,
}

const DreamChartContext = createContext<DreamChartContextType | null>(null)

export function DreamChartProvider({ children }:{ children: React.ReactNode }){
    const [dreamCounts, setDreamCounts] = useState<DreamCounts>([])

    const { refetch } = useDreams()

    useEffect(() => {
        const getDreamChartStats = async () => {
            const response = await fetchDreamChartStats()
            setDreamCounts(response.dreamCounts)
        } 
        getDreamChartStats() 
    }, [refetch])


    return (
        <DreamChartContext.Provider value={{dreamCounts}}>
            {children}
        </DreamChartContext.Provider>
    )
}

export function useDreamChart(){
    const context = useContext(DreamChartContext)

    if (!context){
        throw new Error('useDreamChart must be used within a DreamChartProvider')
    }

    return context
}
