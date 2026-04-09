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
            <div className="grid grid-cols-8">
                <div className="col-span-5 flex justify-start text-sm text-gray-500">
                    {isMedium? 'Dreams' : 'Dream:'} {!loadingDreams && isMedium && `(${dreamsList.length}):`}
                </div>
                <div className="col-span-2">
                    <span className="text-sm text-gray-500">
                    <span>Date: </span>
                    {dreamsList.length > 1 && view === 'dreams' &&
                        <IconWithTooltip icon={faSort} tooltipText={`${!sort ? 'Oldest first' : 'Newest first'}`} onClick={() => setSort(prev => !prev)} extraClass="text-gray-500" />
                    }
                    </span>
                </div>
            </div>
            <div className="grid grid-cols-8 max-h-32 overflow-y-auto scrollbar-custom">
                {dreamsList.map(dream => (
                    <div key={dream._id} className="contents row-span-full">
                        <div onClick={() => handleClick(dream._id)} className="col-span-5 hover:underline cursor-pointer">
                            {dream.title}
                        </div> 
                        {view === 'themes' ? 
                            <div className='col-span-3 pt-1 pl-2 text-gray-500 text-xs'>
                                {formatDate(dream.date, true, true)} 
                            </div>                            
                        :   <div className='col-span-3 pt-1 pl-2 text-sm'>
                                {formatDate(dream.date, true)}
                            </div> 
                        }
                    </div>
                ))}
            </div>
        </div>
    )
}

