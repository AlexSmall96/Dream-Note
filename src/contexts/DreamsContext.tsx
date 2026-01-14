import { DreamOverview } from '@/types/dreams'
import { createContext, useState, useEffect, useCallback, useContext} from 'react'
import { fetchDreams } from '@/lib/api/dreams'

type DreamsContextType = {
    dreams: DreamOverview[],
    setDreams: React.Dispatch<React.SetStateAction<DreamOverview[]>>
}

const DreamsContext = createContext<DreamsContextType | null>(null)

export function DreamsProvider({ children }:{ children: React.ReactNode }) {
    const [dreams, setDreams] = useState<DreamOverview[]>([])
    
    useEffect(() => {
        const getDreams = async () => {
            try {
                const response = await fetchDreams()
                setDreams(response.dreams)
            } catch (err) {
                console.log(err)
            }
        } 
        getDreams()
    }, [])  

    return (
        <DreamsContext.Provider value={{dreams, setDreams}}>
            {children}
        </DreamsContext.Provider>
    )
}

export function useDreams(){
    const context = useContext(DreamsContext)

    if (!context){
        throw new Error('useDreams must be used within a DreamsProvider')
    }

    return context
}