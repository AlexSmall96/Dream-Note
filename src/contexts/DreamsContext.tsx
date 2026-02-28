import { DreamOverview, DreamStats } from '@/types/dreams'
import { createContext, useState, useEffect, useContext} from 'react'
import { fetchDreams, fetchDreamStats, fetchSearchResults } from '@/lib/api/dreams'
import { useThemesAside } from './ThemesAsideContext'
import { setterFunction } from '@/types/setterFunctions'
import { monthlyTotalType } from '@/types/dreams'
import { MONTH_KEYS, MONTH_OPTIONS } from '@/lib/filters/dateRanges'

type DreamsContextType = {
    dreams: DreamOverview[],
    setDreams: setterFunction<DreamOverview[]>,
    searchResults: DreamOverview[],
    setRefetch: setterFunction<boolean>,
    stats: DreamStats,
    setStats: setterFunction<DreamStats>,
}

const DreamsContext = createContext<DreamsContextType | null>(null)

export function DreamsProvider({ children }:{ children: React.ReactNode }) {
    const [dreams, setDreams] = useState<DreamOverview[]>([])
    const [searchResults, setSearchResults] = useState<DreamOverview[]>([])
    const [stats, setStats] = useState<DreamStats>({monthlyTotals: {}, total: 0, thisMonthTotal: 0})
    const [refetch, setRefetch] = useState<boolean>(false)
    const { month, year, sort, search } = useThemesAside()

    useEffect(() => {
        const getDreams = async () => {
            try {
                const response = await fetchDreams({year, month, sort})
                setDreams(response.dreams)
            } catch (err) {
                console.log(err)
            }
        } 
        
        const getStats = async () => {
            try {
                const response = await fetchDreamStats(year)
                const monthlyCounts: {[month: string] : number} = {}
                MONTH_KEYS.map(m => {
                    monthlyCounts[m] = response.monthlyTotals[MONTH_OPTIONS[m]] ?? 0
                })
                setStats({...response, monthlyTotals : monthlyCounts})
            } catch (err){
                console.log(err)

            }
        }
        getDreams()
        getStats()
    }, [month, year, sort, refetch])  

    useEffect(() => {
        if (search.trim() === ''){
            setSearchResults([])
            return 
        }

        const getSearchResults = async () => {
            try {
                const response = await fetchSearchResults(search)
                setSearchResults(response.dreams)
            } catch (err) {
                console.log(err)
            }            
        }

        getSearchResults()
    }, [search])

    return (
        <DreamsContext.Provider value={{dreams, setDreams, searchResults, setRefetch, stats, setStats}}>
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