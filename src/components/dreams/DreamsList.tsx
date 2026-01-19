"use client"

import { useRouter } from "next/navigation"
import { useDreams } from "@/contexts/DreamsContext"

export default function DreamsList(){
    const { dreams } = useDreams()
    const router = useRouter()


    return (
        <div className="grid grid-cols-3 gap-4">
            <div className='text-lg font-bold col-span-2'>Dream</div>
            <div className='text-lg font-bold'>Date</div>
            {dreams.map(dream => 
                <>
                    <div onClick={() => router.replace(`/dreams/${dream._id}`)} className="col-span-2 hover:underline font-semibold">{dream.title}</div>
                    <div>{new Date(dream.date).toLocaleDateString()}</div>
                </>)}
        </div>
    )
}

