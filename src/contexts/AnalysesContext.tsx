import React, { createContext, useContext } from "react";

type AnalysesContextType = {
    dreamId: string
    title: string
    description: string
}

export const AnalysesContext = createContext<AnalysesContextType | null>(null)

export const AnalysesProvider = ({ dreamId,title, description, children }: { dreamId: string, title: string, description: string, children: React.ReactNode }) => {
    return (
        <AnalysesContext.Provider value={{ dreamId, title, description }}>
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