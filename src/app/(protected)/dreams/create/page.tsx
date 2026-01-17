"use client";
import DreamForm from "@/components/dreams/DreamForm.js";
import { logNewDream } from "@/lib/api/dreams.js";
import { DreamFormType } from "@/types/dreams.js";
import { useState } from "react";
import { useDreams } from "@/contexts/DreamsContext.js";

export default function LogNewDream() {
    // State and contexts
    const [dream, setDream] = useState<DreamFormType>({title: '', description: '', notes: '', date: new Date().toISOString().split('T')[0]})
    const [themes, setThemes] = useState<string[]>([])
    const [msg, setMsg] = useState<string>('')
    const {setDreams} = useDreams()

    // Log new dream
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        const payload = {
            ...dream, date: new Date(dream.date)
        }
        const result = await logNewDream({dream: payload, themes}) 
        if ('error' in result){
            return setMsg(result.error)
        }
        // Extract overview and add to dreams list to appear in side bar
        const dreamOverview = {title: result.dream.title, date: result.dream.date, _id: result.dream._id}
        setDreams(prev => [dreamOverview, ... prev])
        setMsg('Dream logged')
    }

    return (
        <div className="flex flex-col items-center m-4">
            <DreamForm 
                dream={dream} 
                setDream={setDream} 
                themes={themes}
                setThemes={setThemes}
                handleSubmit={handleSubmit}
                msg={msg}
                setMsg={setMsg}
            />
        </div>
    )
}