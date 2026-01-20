"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useDreams } from "@/contexts/DreamsContext"
import { useThemes } from "@/contexts/ThemesContext"
import { useThemesAside } from "@/contexts/ThemesAsideContext"

export default function DreamsList(){

    const { dreams } = useDreams()
    const { themes } = useThemes()
    const { selectedTheme } = useThemesAside()
    const searchParams = useSearchParams()

    const view = searchParams.get('view') ?? 'dreams'

    const dreamsList = selectedTheme ? 
        themes.filter(
            theme => 
                theme.theme === selectedTheme
        ).map(
            theme => 
                theme.dream
        ) : dreams

    const router = useRouter()

    return (
        <div className="grid grid-cols-3 gap-4">
            <div className='text-lg font-bold col-span-2'>Dream</div>
            <div className='text-lg font-bold'>Date</div>
            {dreamsList.map(dream => 
                <>
                    <div onClick={() => router.replace(`/dreams/${dream._id}?view=${view}`)} className="col-span-2 hover:underline font-semibold">{dream.title}</div>
                    <div>{new Date(dream.date).toLocaleDateString()}</div>
                </>)}
        </div>
    )
}

