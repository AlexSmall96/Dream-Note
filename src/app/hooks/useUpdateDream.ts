"use client";
import { DreamFormType } from "@/types/dreams";
import { useDreamSubmit } from "@/app/hooks/useDreamSubmit";
import { useThemes } from "@/contexts/ThemesContext";
import { useState } from "react";

export function useUpdateDream() {
    const { submitDream, msg, setMsg } = useDreamSubmit()
    const { setRefetchThemes } = useThemes()
	const [submitting, setSubmitting] = useState(false)
	
    const updateDream = async (dream: DreamFormType, themes: string[],  id: string ) => {
		setSubmitting(true)
		await submitDream({
			id,
			title: dream.title,
			description: dream.description,
			notes: dream.notes,
			date: new Date(dream.date),
			themes: themes
		})	
        setRefetchThemes(prev => !prev)
        setSubmitting(false)
    }

    return { updateDream, msg, setMsg, submitting }
}