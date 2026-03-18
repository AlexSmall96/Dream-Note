"use client"

import { useThemesAside } from "@/contexts/ThemesAsideContext"
import { MONTH_KEYS, MonthLabel } from "@/lib/filters/dateRanges"
import DreamsList from "./DreamsList"
import { useDreamCounts } from "@/contexts/DreamCountsContext"

export default function MonthsWithDreams(){

    const { month, setMonth, year, showDreams, setShowDreams } = useThemesAside()
    const { stats } = useDreamCounts()
    const monthlyTotals = stats.monthlyTotals

    const handleMonthSelect = (m:MonthLabel) => {
        const isSameMonth = month === m
        if (isSameMonth){
            setShowDreams(prev => !prev)
        } else {
            setMonth(m)
            setShowDreams(true)
        }
    }

    return (
        <div>
            <div>
                {Object.keys(monthlyTotals).length !==0 ? MONTH_KEYS.map(m => 
                    monthlyTotals[m] > 0 &&
                    <div key={m}>
                        <button 
                            className='bg-blue-200 p-2 m-1' 
                            onClick={() => handleMonthSelect(m)}
                        >
                            {m} {`(${monthlyTotals[m]})`}
                        </button>
                        {m === month && showDreams && <DreamsList key={`${year}-${month}`} /> }
                    </div>
                ): `No dreams recorded in ${year}.`}
            </div>
        </div>
    )
}