import { setterFunction } from "@/types/setterFunctions";
import React, { createContext, useContext } from "react";

type AnalysesContextType = {
    dreamId: string
    title: string
    description: string
    showMainAnalysis: boolean,
    setShowMainAnalysis: setterFunction<boolean>,
    setShowHeader: setterFunction<boolean>
}

export const AnalysesContext = createContext<AnalysesContextType | null>(null)

export const AnalysesProvider = ({ dreamId,title, description, showMainAnalysis, setShowMainAnalysis, setShowHeader, children }: { dreamId: string, title: string, description: string, showMainAnalysis: boolean, setShowMainAnalysis: setterFunction<boolean>, setShowHeader: setterFunction<boolean>, children: React.ReactNode }) => {
    return (
        <AnalysesContext.Provider value={{ dreamId, title, description, showMainAnalysis, setShowMainAnalysis, setShowHeader }}>
            {children}
        </AnalysesContext.Provider>
    )
}

export const useAnalysesContext = () => {
    const context = useContext(AnalysesContext)

    if (!context) {
        throw new Error('useAnalysesContext must be used within an AnalysesProvider')
    }
    return context

}