"use client"

import { useRouter } from "next/navigation"
import { useDreams } from "@/contexts/DreamsContext"
import { useThemes } from "@/contexts/ThemesContext"
import { useThemesAside } from "@/contexts/ThemesAsideContext"
import { formatDate } from "@/lib/utils/formatDate"
import IconWithTooltip from "../ui/IconWithTooltip"
import { faSort } from "@fortawesome/free-solid-svg-icons"
import { useScreenSize } from "@/app/hooks/useScreenSize"
import LoadingSpinner from "../ui/LoadingSpinner"
import { useDreamCounts } from "@/contexts/DreamCountsContext"

export default function DreamsList(){

    const { dreams, loadingDreams } = useDreams()
    const { themes } = useThemes()
    const { selectedTheme, setChronView, view, sort, setSort, setIsOpen } = useThemesAside()
    const {loadingCounts} = useDreamCounts()
    const { isMedium } = useScreenSize()
    
    const dreamsList = view === 'themes' ? 
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
        setIsOpen(false)
    }

    return (
        loadingCounts ? <LoadingSpinner /> :
        <div className="gap-1 p-2 rounded bg-white/60 hover:bg-white border border-gray-200">
            {isMedium && 
            <div className="grid grid-cols-8">
                <div className="col-span-5 flex justify-start pr-2 text-sm text-gray-500">
                    Dreams {!loadingDreams && `(${dreamsList.length})`}:
                </div>
                <div className="col-span-2">
                    <span className="text-sm text-gray-500">
                        Date:
                    </span>
                </div>
                <div className="col-span-1 flex justify-start pl-2">
                    {dreamsList.length > 1 && view === 'dreams' &&
                        <IconWithTooltip icon={faSort} tooltipText={`${!sort ? 'Oldest first' : 'Newest first'}`} onClick={() => setSort(prev => !prev)} extraClass="text-gray-500" />
                    }
                </div>
            </div>}
            <div className="grid grid-cols-8 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-gray-100">
                {dreamsList.map(dream => (
                    <div key={dream._id} className="contents row-span-full">
                        <div onClick={() => handleClick(dream._id)} className="col-span-5 hover:underline cursor-pointer">
                            {dream.title}
                        </div> 
                        {view === 'themes' ? 
                            <div className='col-span-3 pt-1 text-gray-500 text-xs md:justify-self-end'>
                                {formatDate(dream.date, true, true)} 
                            </div>                            
                        :   <div className='col-span-3 pt-1 text-xs md:justify-self-end'>
                                {formatDate(dream.date, true)}
                            </div> 
                        }
                    </div>
                ))}
            </div>
        </div>
    )
}

