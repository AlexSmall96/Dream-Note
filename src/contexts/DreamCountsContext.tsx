import { DreamStats } from '@/types/dreams'
import { createContext, useState, useEffect, useContext} from 'react'
import { fetchDreamCounts } from '@/lib/api/dreams'
import { useThemesAside } from './ThemesAsideContext'
import { setterFunction } from '@/types/setterFunctions'
import { MONTH_KEYS, MONTH_OPTIONS } from '@/lib/filters/dateRanges'
import { useDreams } from './DreamsContext'

type DreamCountsContextType = {
    stats: DreamStats,
    setStats: setterFunction<DreamStats>,
    loadingCounts: boolean,
    setLoadingCounts: setterFunction<boolean>
}

const DreamCountsContext = createContext<DreamCountsContextType | null>(null)

export function DreamCountsProvider({ children }:{ children: React.ReactNode }) {
    const [stats, setStats] = useState<DreamStats>({monthlyTotals: {}, total: 0, thisMonthTotal: 0, uniqueYears: []})
    const { refetchDreams } = useDreams()
    const { year, setMonthString } = useThemesAside()
    const [loadingCounts, setLoadingCounts] = useState(false)

    useEffect(() => {

        const getCounts = async () => {
            try {
                setLoadingCounts(true)
                const response = await fetchDreamCounts(Number(year))
                const monthlyCounts: {[month: string] : number} = {}
                MONTH_KEYS.map(m => {
                    monthlyCounts[m] = response.monthlyTotals[MONTH_OPTIONS[m]] ?? 0
                })
                setStats({...response, monthlyTotals : monthlyCounts})
                setMonthString('')
            } catch (err){
                console.log(err)
            } finally {
                setLoadingCounts(false)
            }
        }
        getCounts()
    }, [year, refetchDreams])  

    return (
        <DreamCountsContext.Provider value={{stats, setStats, loadingCounts, setLoadingCounts}}>
            {children}
        </DreamCountsContext.Provider>
    )
}

export function useDreamCounts(){
    const context = useContext(DreamCountsContext)

    if (!context){
        throw new Error('useDreamCounts must be used within a DreamCountsProvider')
    }

    return context
}