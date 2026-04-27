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
        <div className={`rounded mt-1 ${view === 'dreams' ? 'ml-1':''} bg-white/60 hover:bg-white ${ isMedium ? 'border border-gray-200 p-2' : ''}`}>
            <div className="grid grid-cols-10">
                <div className={`${view === 'dreams' ? 'col-span-7' : 'col-span-6'} flex justify-start text-sm text-gray-500`}>
                    {isMedium? 'Dreams' : 'Dream:'} {!loadingDreams && isMedium && `(${dreamsList.length}):`}
                </div>
                <div className={`${view === 'dreams' ? 'col-span-3' : 'col-span-4'} flex items-center justify-start text-sm text-gray-500`}>
                    Date: 
                    {dreamsList.length > 1 && view === 'dreams' &&
                        <IconWithTooltip 
                        icon={faSort} 
                        tooltipText={`${!sort ? 'Oldest first' : 'Newest first'}`} 
                        onClick={() => setSort(prev => !prev)} 
                        extraClass="text-gray-500 ml-1" />
                    }
                </div>
            </div>
            <div className="grid grid-cols-10 max-h-32 overflow-y-scroll scrollbar-custom">
                {dreamsList.map(dream => (
                    <div key={dream._id} className="contents row-span-full">
                        <div className={`truncate pr-1 ${view === 'dreams' ? 'col-span-7' : 'col-span-6'} hover:underline cursor-pointer`} onClick={() => handleClick(dream._id)}>
                            {dream.title}
                        </div> 
                        {view === 'themes' ? 
                            <div className='col-span-4 pl-2 pt-1 text-gray-500 text-xs'>
                                {formatDate(dream.date, true, true)} 
                            </div>                            
                        :   <div className='col-span-3 pl-2 flex items-center justify-start pt-1 text-sm'>
                                {formatDate(dream.date, true)}
                            </div> 
                        }
                    </div>
                ))}
            </div>
        </div>
    )
}

