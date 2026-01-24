import { DreamOverview } from '@/types/dreams'
import { createContext, useState, useEffect, useContext} from 'react'
import { fetchDreams, fetchSearchResults } from '@/lib/api/dreams'
import { useThemesAside } from './ThemesAsideContext'
import { setterFunction } from '@/types/setterFunctions'

type DreamsContextType = {
    dreams: DreamOverview[],
    setDreams: setterFunction<DreamOverview[]>,
    searchResults: DreamOverview[]
}

const DreamsContext = createContext<DreamsContextType | null>(null)

export function DreamsProvider({ children }:{ children: React.ReactNode }) {
    const [dreams, setDreams] = useState<DreamOverview[]>([])
    const [searchResults, setSearchResults] = useState<DreamOverview[]>([])
    const { month, year, sort, search, setSearchView } = useThemesAside()

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

    useEffect(() => {
        if (search.trim() === ''){
            setSearchResults([])
            return 
        }

        const getSearchResults = async () => {
            try {
                const response = await fetchSearchResults(search)
                setSearchResults(response.dreams)
                setSearchView(true)
            } catch (err) {
                console.log(err)
            }            
        }

        getSearchResults()
    }, [search])

    return (
        <DreamsContext.Provider value={{dreams, setDreams, searchResults}}>
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