"use client";
import DreamForm from "@/components/dreams/DreamForm";
import { logNewDream } from "@/lib/api/dreams";
import { DreamFormType } from "@/types/dreams";
import { useState } from "react";
import { useDreams } from "@/contexts/DreamsContext";

export default function LogNewDream() {
    const [dream, setDream] = useState<DreamFormType>({})
    const [msg, setMsg] = useState<string>('')

    const {setDreams} = useDreams()
    
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        const result = await logNewDream({dream, themes: []}) 
        if ('error' in result){
            return setMsg(result.error)
        }
        const dreamOverview = {title: result.dream.title, date: result.dream.date, _id: result.dream._id}
        setDreams(prev => [dreamOverview, ... prev])
        setMsg('Dream logged')
    }

    return (
        <div className="flex flex-col items-center m-4">
            <DreamForm 
                dream={dream} 
                setDream={setDream} 
                handleSubmit={handleSubmit}
                msg={msg}
                setMsg={setMsg}
            />
        </div>
    )
}