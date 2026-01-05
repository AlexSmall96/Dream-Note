"use client"

import { useEffect, useState } from "react"
import { fetchAnalysis, fetchFullDream, DreamFullView } from '@/lib/api/dreams'
import Dropdown from "../ui/dropdown"

export default function DreamView (props: {id: string}){
        const [dream, setDream] = useState<DreamFullView>({
            title: '', date: new Date(), owner: '', _id: '', __v: 0,
        })
        const [themes, setThemes] = useState<{theme: string, dream: string}[]>([])
        const [analysis, setAnalysis] = useState<string>('')
        const [tone, setTone] = useState('Curious & intrigued')
        const [style, setStyle] = useState('Informal')
        const [showSettings, setShowSettings] = useState(false)

        useEffect(() => {
            const getFullDream = async () => {
                try {
                    const response = await fetchFullDream(props.id)
                    setDream(response.dream) 
                    setThemes(response.themes || [])
                } catch (err){
                    console.log(err)
                }
            }
            getFullDream()
        }, [])

        const handleClick = async () => {
            if (!dream.description) return
            try {
                const response = await fetchAnalysis({description: dream.description, tone, style})
                setAnalysis(response.analysis)
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
                {themes.map(theme =>
                    <span className="bg-brand-softer border border-brand-subtle text-fg-brand-strong text-xs font-medium px-1.5 py-0.5 rounded">
                        {theme.theme}
                    </span>
                 )}
                <p className="italic">{analysis ?? ''}</p>
                <button 
                    onClick={handleClick}
                    disabled={!dream.description}
                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 disabled:cursor-not-allowed disabled:bg-gray-400'
                >
                    Get AI Analysis
                </button>
                <button 
                    onClick={() => setShowSettings(!showSettings)} 
                    className='bg-cyan-500 text-white font-bold p-2 m-2'
                >
                    {!showSettings? 'Show': 'Hide'} settings  
                </button>
                {showSettings?
                        <>
                            <Dropdown parameter='tone' setParameter={setTone} selected={tone} />
                            <Dropdown parameter='style' setParameter={setStyle} selected={style} />                        
                        </>
                    :''}
            </div>
        )
}