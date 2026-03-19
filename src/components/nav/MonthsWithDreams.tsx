"use client"

import { useThemesAside } from "@/contexts/ThemesAsideContext"
import { MONTH_KEYS, MonthLabel } from "@/lib/filters/dateRanges"
import DreamsList from "./DreamsList"
import { useDreamCounts } from "@/contexts/DreamCountsContext"
import Dropdown from "../ui/Dropdown"

export default function MonthsWithDreams(){

    const { month, setMonth, year, setYear, showDreams, setShowDreams } = useThemesAside()
    const { stats } = useDreamCounts()
    const monthlyTotals = stats.monthlyTotals
    const uniqueYears = stats.uniqueYears
    
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
            <Dropdown<string> parameter={year} setParameter={setYear} options={uniqueYears} placeholder={'Select Year'} />
            {Object.keys(monthlyTotals).length !==0 ? MONTH_KEYS.map(m => 
                monthlyTotals[m] > 0 &&
                <div key={m} className="mt-0.5">
                    <button 
                        className={`${m === month ? 'bg-purple-400 shadow-md font-bold text-white' : 'bg-purple-200'} p-0.5 my-0.5 rounded shadow-sm border-l-2 border-black/20 w-full text-left`}
                        onClick={() => handleMonthSelect(m)}
                    >
                        {m} <span className={`${m === month ? 'text-white' : 'text-gray-500'} text-sm`}>({monthlyTotals[m]})</span>
                    </button>
                    {m === month && showDreams && <DreamsList key={`${year}-${month}`} /> }
                </div>
            ): `No dreams recorded in ${year}.`}
        </div>
    )
}