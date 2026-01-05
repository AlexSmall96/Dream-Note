"use client"

import { useEffect, useState } from "react"
import { fetchAnalysis, fetchFullDream, DreamResponseType, DreamFullView } from '@/lib/api/dreams'
import { useRouter } from "next/navigation"

export default function DreamView (props: {id: string}){
        const [dream, setDream] = useState<DreamFullView>({
            title: '', date: new Date(), owner: '', _id: '', __v: 0,
        })
        const [themes, setThemes] = useState<string[]>([])
        const [analysis, setAnalysis] = useState<string>('')

        useEffect(() => {
            const getFullDream = async () => {
                try {
                    const response = await fetchFullDream(props.id)
                    setDream(response.dream) 
                } catch (err){
                    console.log(err)
                }
            }
            getFullDream()
        }, [])

        const handleClick = async () => {
            if (!dream.description) return
            try {
                const response = await fetchAnalysis({description: dream.description})
                console.log(response)
            } catch (err){
                console.log(err)
            }
        }


        return (
            <div className="flex flex-col items-center">
                <h1>{dream.title}</h1>
                <h1>{new Date(dream.date).toLocaleDateString()}</h1>
                <p>{dream.description}</p>
                <p>{dream.notes}</p>
                {analysis ?? ''}
                <button 
                    onClick={handleClick}
                    disabled={!dream.description}
                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 disabled:cursor-not-allowed disabled:bg-gray-400'
                >
                    Get AI Analysis</button>
            </div>
            
        )
}