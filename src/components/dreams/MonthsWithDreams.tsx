"use client"

import { useThemesAside } from "@/contexts/ThemesAsideContext"
import { MONTH_KEYS, MonthLabel } from "@/lib/filters/dateRanges"
import DreamsList from "./DreamsList"
import { useDreams } from "@/contexts/DreamsContext"

export default function MonthsWithDreams(){

    const { month, setMonth, year, setYear, showDreams, setShowDreams, sort, setSort } = useThemesAside()
    const { stats } = useDreams()
    const monthlyTotals = stats.monthlyTotals
    const now = new Date()
    const currentYear = now.getFullYear()

    const handleYearChange = (up: boolean) => {
        const oldYear = year
        if ((up && oldYear < currentYear) || (!up && oldYear > 1900)){
            setYear(prev => prev + (up? 1: -1))
        }
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
            {year > 1900 && <button onClick={() => handleYearChange(false)} className='bg-gray-200 m-1 p-2'>-</button>}
            <span className='bg-gray-400 m-1 p-2'>{year}</span>
            {year < currentYear && <button onClick={() => handleYearChange(true)}  className='bg-gray-200 m-1 p-2'>+</button>}
            <button onClick={() => setSort(prev => !prev)}className='bg-green-300 m-1 p-2'>{sort? '↑ Oldest first' : '↓ Newest first' }</button>
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