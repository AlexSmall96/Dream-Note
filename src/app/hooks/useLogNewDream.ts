"use client";
import { DreamFormType } from "@/types/dreams";
import { useDreamSubmit } from "@/app/hooks/useDreamSubmit";
import { useThemes } from "@/contexts/ThemesContext";

export function useLogNewDream() {
    const { submitDream, msg, setMsg } = useDreamSubmit()
    const { setRefetchThemes } = useThemes()

    const logDream = async (dream: DreamFormType, themes: string[]) => {
        await submitDream({
            title: dream.title,
            description: dream.description,
            notes: dream.notes,
            date: new Date(dream.date),
            themes
        })
        setRefetchThemes(prev => !prev)
    }

    return { logDream, msg, setMsg }
}