import { DreamOverview } from '@/types/dreams'
import { createContext, useState, useEffect, useContext} from 'react'
import { fetchDreams } from '@/lib/api/dreams'
import { useThemesAside } from './ThemesAsideContext'
import { setterFunction } from '@/types/setterFunctions'

type DreamsContextType = {
    dreams: DreamOverview[],
    setDreams: setterFunction<DreamOverview[]>,
}

const DreamsContext = createContext<DreamsContextType | null>(null)

export function DreamsProvider({ children }:{ children: React.ReactNode }) {
    const [dreams, setDreams] = useState<DreamOverview[]>([])
    const { month, year, sort } = useThemesAside()

    useEffect(() => {
        const getDreams = async () => {
            try {
                const response = await fetchDreams({year, month, sort})
                setDreams(response.dreams)
            } catch (err) {
                console.log(err)
            }
        } 
        getDreams()
    }, [month, year, sort])  

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