"use client"

import { useEffect, useState } from "react"
import { fetchFullDream } from '@/lib/api/dreams'
import { useRouter } from "next/navigation"

export default function DreamView ({id}){
        const [dream, setDream] = useState({})

        useEffect(() => {
            const getDreams = async () => {
                const response = await fetchFullDream(id)
                setDream(response.dream)
            }
            getDreams()
        })

        return (
            <div className="flex flex-col items-center">
                <h1>{dream.title}</h1>
                <h1>{dream.date}</h1>
                <p>{dream.description}</p>
                <p>{dream.notes}</p>
            </div>
            
        )
}