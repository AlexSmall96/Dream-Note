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
            {dreams.length > 0 && (
            <div className="grid grid-cols-3 gap-1 bg-[url('/images/paper.jpg')] bg-repeat p-2 rounded rounded-lg shadow-lg border border-purple-100">
                <div className="col-span-1 flex justify-start mb-2 pr-2">
                    {dreams.length} {dreams.length === 1 ? 'dream' : 'dreams'}
                </div>
                <div className="col-span-2 flex justify-start mb-2 pl-2">
                    {dreams.length > 1 &&
                        <IconWithTooltip icon={faSort} tooltipText={`${!sort ? 'Oldest first' : 'Newest first'}`} onClick={() => setSort(prev => !prev)} extraClass="text-gray-500" />
                    }
                </div>
                {dreamsList.map(dream => (
                    <div key={dream._id} className="contents font-playwrite">
                        {view === 'dreams' && <div>{formatDate(dream.date)}</div>}
                        <div
                            onClick={() => handleClick(dream._id)}
                            className="col-span-2 hover:underline cursor-pointer"
                        >
                            {dream.title}
                        </div>
                    </div>
                ))}
            </div>
            )}
        </>
    )
}

