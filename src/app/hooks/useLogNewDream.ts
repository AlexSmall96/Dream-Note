"use client";
import { DreamFormType } from "@/types/dreams";
import { useDreamSubmit } from "@/app/hooks/useDreamSubmit";
import { useThemes } from "@/contexts/ThemesContext";
import { useState } from "react";

export function useLogNewDream() {
    const { submitDream, msg, setMsg } = useDreamSubmit()
    const { setRefetchThemes } = useThemes()
    const [submitting, setSubmitting] = useState(false)
    
    const logDream = async (dream: DreamFormType, themes: string[]) => {
        setSubmitting(true)
        await submitDream({
            title: dream.title,
            description: dream.description,
            notes: dream.notes,
            date: new Date(dream.date),
            themes
        })
        setRefetchThemes(prev => !prev)
        setSubmitting(false)
    }

    return { logDream, msg, setMsg, submitting }
}