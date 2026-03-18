"use client"

import { useRouter } from "next/navigation"
import { useDreams } from "@/contexts/DreamsContext"
import { useThemes } from "@/contexts/ThemesContext"
import { useThemesAside } from "@/contexts/ThemesAsideContext"
import { formatDate } from "@/lib/utils/formatDate"
import IconWithTooltip from "../ui/IconWithTooltip"
import { faSort } from "@fortawesome/free-solid-svg-icons"

export default function DreamsList(){

    const { dreams } = useDreams()
    const { themes } = useThemes()
    const { selectedTheme, setChronView, view, sort, setSort} = useThemesAside()

    const dreamsList = selectedTheme ? 
        themes.filter(
            theme => 
                theme.theme === selectedTheme
        ).map(
            theme => 
                theme.dream
        ) : dreams

    const router = useRouter()

    const handleClick = (dreamId: string) => {
        router.replace(`/dreams/${dreamId}`)
        setChronView(view === 'dreams')
    }

    return (
        <>
            {dreamsList.length > 0 ? (
            <div className="grid grid-cols-5 gap-1 p-2 rounded bg-white/60 hover:bg-white border border-gray-200">
                <div className="col-span-3 flex justify-start mb-2 pr-2 text-sm text-gray-500">
                    Dreams ({dreamsList.length}):
                </div>
                <div className="col-span-1">
                    <span className="text-sm text-gray-500">
                        Date:
                    </span>
                </div>
                <div className="col-span-1 flex justify-start mb-2 pl-2">
                    {dreamsList.length > 1 &&
                        <IconWithTooltip icon={faSort} tooltipText={`${!sort ? 'Oldest first' : 'Newest first'}`} onClick={() => setSort(prev => !prev)} extraClass="text-gray-500" />
                    }
                </div>
                {dreamsList.map(dream => (
                    <div key={dream._id} className="contents row-span-full">
                        <div onClick={() => handleClick(dream._id)} className="col-span-3 hover:underline cursor-pointer">
                            {dream.title}
                        </div> 
                        <div className={`col-span-1 ${view === 'themes' ? 'text-gray-500 text-sm' : ''}`}>{formatDate(dream.date)}</div>
                    </div>
                ))}
            </div>
            ): ('')}
        </>
    )
}

