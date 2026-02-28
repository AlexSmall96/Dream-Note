"use client";
import DreamForm from "@/components/dreams/DreamForm";
import { DreamFormType } from "@/types/dreams";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDreamSubmit } from "@/app/hooks/useDreamSubmit";
import { useThemes } from "@/contexts/ThemesContext";

export default function LogNewDream() {
    // State and contexts
    const defaultDreamState = {title: '', description: '', notes: '', date: new Date().toISOString().split('T')[0]}
    const [dream, setDream] = useState<DreamFormType>(defaultDreamState)
    const [themes, setThemes] = useState<string[]>([])
    const { submitDream, msg, setMsg } = useDreamSubmit()
    const { setRefetchThemes } = useThemes()
    const router = useRouter()
    
    // Log new dream
	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault()
		await submitDream({
			title: dream.title,
			description: dream.description,
			notes: dream.notes,
			date: new Date(dream.date),
			themes: themes
		})
        setDream(defaultDreamState)
        setThemes([])		
        setRefetchThemes(prev => !prev)
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
                handleGoBack={() => router.replace('/dreams')}
                backText="Back to Dashboard"
            />
        </div>
    )
}