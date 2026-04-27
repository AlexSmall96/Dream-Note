"use client";
import DreamForm from "@/components/dreams/DreamForm";
import { DreamFormType } from "@/types/dreams";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLogNewDream } from "@/app/hooks/useLogNewDream";

export default function LogNewDream() {

    // State and contexts
    const defaultDreamState = {title: '', description: '', notes: '', date: new Date().toISOString().split('T')[0]}
    const [dream, setDream] = useState<DreamFormType>(defaultDreamState)
    const [themes, setThemes] = useState<string[]>([])
    const router = useRouter()
    const { logDream, msg, setMsg, submitting } = useLogNewDream()

    // Log new dream
	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault()
		const dreamId = await logDream(dream, themes)
        setDream(defaultDreamState)
        setThemes([])		
        router.replace(`/dreams/${dreamId}?created=true`)
	}

    return (
        <div className="flex flex-col items-center">
            <h1 className="header-content">Log New Dream</h1>
            <DreamForm 
                dream={dream} 
                setDream={setDream} 
                themes={themes}
                setThemes={setThemes}
                handleSubmit={handleSubmit}
                msg={msg}
                setMsg={setMsg}
                backHref='/dreams'
                backText="Back to Dashboard"
                submitting={submitting}
            />
        </div>
    )
}