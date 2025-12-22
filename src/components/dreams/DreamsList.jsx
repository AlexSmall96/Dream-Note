"use client"

import { useEffect, useState } from "react"
import { fetchDreams } from '@/lib/api/dreams'
import { useRouter } from "next/navigation"

export default function DreamsList(){
    const [dreams, setDreams] = useState([])
    const router = useRouter()

    useEffect(() => {
        const getDreams = async () => {
            try {
                const response = await fetchDreams()
                setDreams(response.dreams)
            } catch (err) {
                console.log(err)
            }
        } 
        getDreams()
        
    }, [])

    return (
        <div className="grid grid-cols-3 gap-4">
            <div className='text-lg font-bold col-span-2'>Dream</div>
            <div className='text-lg font-bold'>Date</div>
            {dreams.map(dream => 
                <>
                    <div onClick={() => router.replace(`/dreams/${dream._id}`)} className="col-span-2 hover:underline font-semibold">{dream.title}</div>
                    <div>{dream.date}</div>
                </>)}
        </div>
    )
}

