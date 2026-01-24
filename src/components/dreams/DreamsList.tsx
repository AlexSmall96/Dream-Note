"use client"

import { useRouter } from "next/navigation"
import { useDreams } from "@/contexts/DreamsContext"
import { useThemes } from "@/contexts/ThemesContext"
import { useThemesAside } from "@/contexts/ThemesAsideContext"
import { formatDate } from "@/lib/utils/formatDate"

export default function DreamsList(){

    const { dreams } = useDreams()
    const { themes } = useThemes()
    const { selectedTheme, setSearchView} = useThemesAside()


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
        setSearchView(false)
    }

    return (
        <>
            {dreams.length > 0 &&
            <div className="grid grid-cols-3 gap-1">
                {dreamsList.map(dream => 
                    <>
                    <div>{formatDate(dream.date)}</div>
                    <div onClick={() => handleClick(dream._id)} className="col-span-2 hover:underline">{dream.title}</div>
                    </>)}
            </div>}
        </>
    )
}

