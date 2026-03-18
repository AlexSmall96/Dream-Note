import { useThemesAside } from "@/contexts/ThemesAsideContext"


export default function YearSelect () {


    const { year, setYear, sort, setSort } = useThemesAside()
    const now = new Date()
    const currentYear = now.getFullYear()
    
    const handleYearChange = (up: boolean) => {
        const oldYear = year
        if ((up && oldYear < currentYear) || (!up && oldYear > 1900)){
            setYear(prev => prev + (up? 1: -1))
        }
    }


    return (
        <>
            {year > 1900 && <button onClick={() => handleYearChange(false)} className='bg-gray-200 m-1 p-2'>-</button>}
            <span className='bg-gray-400 m-1 p-2'>{year}</span>
            {year < currentYear && <button onClick={() => handleYearChange(true)}  className='bg-gray-200 m-1 p-2'>+</button>}
            <button onClick={() => setSort(prev => !prev)}className='bg-green-300 m-1 p-2'>{sort? '↑ Oldest first' : '↓ Newest first' }</button>
        </>
    )
}