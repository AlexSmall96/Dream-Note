"use client";
import DreamView from '@/components/dreams/DreamView'
import { useEffect, useState } from "react";
import { fetchFullDream, fetchAnalysis } from "@/lib/api/dreams";
import { useDreamView } from '@/contexts/DreamViewContext';
import { useRouter } from 'next/navigation';
import { useDreams } from '@/contexts/DreamsContext';

export default function DreamPage({ params }: { params: { id: string } }) {

    const { dream, setDream, setThemes, setAnalysis, tone, style } = useDreamView()
    const { dreams } = useDreams()
    const [index,  setIndex] = useState<number>(0)

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

    useEffect(() => {
        const newIndex = dreams.findIndex(d => d._id === params.id)
        if (newIndex !== -1 && newIndex !== index) {
            setIndex(newIndex)
        }
    }, [params.id, dreams])

    const router = useRouter()

    const goToNextDream = () => {
    if (index < dreams.length - 1) {
        router.push(`/dreams/${dreams[index + 1]._id}`)
    }
    }

    const goToPrevDream = () => {
    if (index > 0) {
        router.push(`/dreams/${dreams[index - 1]._id}`)
    }
    }

    return (
        <div className="flex flex-col items-center m-4">
            <DreamView getAnalysis={getAnalysis} id={params.id} onNext={goToNextDream} onPrev={goToPrevDream} index={index} maxIndex={dreams.length - 1} />
        </div>
    )
}