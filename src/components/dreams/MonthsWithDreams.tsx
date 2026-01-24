"use client"

import { useThemesAside } from "@/contexts/ThemesAsideContext"
import { MONTH_KEYS, MonthLabel } from "@/lib/filters/dateRanges"
import DreamsList from "./DreamsList"
import { useDreams } from "@/contexts/DreamsContext"

export default function MonthsWithDreams(){

    const { month, setMonth, year, setYear, showDreams, setShowDreams, sort, setSort } = useThemesAside()
    const { stats } = useDreams()

    const handleYearChange = (up: boolean) => {
        setYear(prev => prev + (up? 1: -1))
    }

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
            <button onClick={() => handleYearChange(false)} className='bg-gray-200 m-1 p-2'>-</button>
            <span className='bg-gray-400 m-1 p-2'>{year}</span>
            <button onClick={() => handleYearChange(true)}  className='bg-gray-200 m-1 p-2'>+</button>
            <button onClick={() => setSort(prev => !prev)}className='bg-green-300 m-1 p-2'>{sort? '↑ Oldest first' : '↓ Newest first' }</button>
            <div>
                {MONTH_KEYS.map(m => 
                    stats[m] > 0 &&
                    <div key={m}>
                        <button 
                            className='bg-blue-200 p-2 m-1' 
                            onClick={() => handleMonthSelect(m)}
                        >
                            {m} {`(${stats[m]})`}
                        </button>
                        {m === month && showDreams && <DreamsList key={`${year}-${month}`} /> }
                    </div>
                )}
            </div>
        </div>
    )
}