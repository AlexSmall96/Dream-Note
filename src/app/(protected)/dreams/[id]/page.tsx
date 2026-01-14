"use client";
import DreamView from '@/components/dreams/DreamView'
import { useEffect } from "react";
import { fetchFullDream, fetchAnalysis } from "@/lib/api/dreams";
import { useDreamView } from '@/contexts/DreamViewContext';

export default function DreamPage({ params }: { params: { id: string } }) {

    const { dream, setDream, setThemes, setAnalysis, tone, style } = useDreamView()

    useEffect(() => {
        const getFullDream = async () => {
            try {
                const response = await fetchFullDream(params.id)
                setDream(response.dream) 
                setThemes(response.themes || [])
            } catch (err){
                console.log(err)
            }
        }
        getFullDream()
    }, [])

    const getAnalysis = async () => {
        if (!dream.description) return
        try {
            const response = await fetchAnalysis({description: dream.description, tone, style})
            setAnalysis(response.analysis)
        } catch (err){
            console.log(err)
        }
    }

    return (
        <div className="flex flex-col items-center m-4">
            <DreamView getAnalysis={getAnalysis} />
        </div>
    )
}