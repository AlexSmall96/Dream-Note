"use client";
import AnalysesView from "@/components/analyses/AnalysesView";
import { AnalysesProvider } from "@/contexts/AnalysesContext";
import { fetchFullDream } from "@/lib/api/dreams";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DreamAnalysisPage ({ params }: { params: { id: string } }) {

    const [loading, setLoading] = useState(true)
    const [description, setDescription] = useState('')
    const [title, setTitle] = useState('')

    const router = useRouter()

    useEffect(() => {
        const getDreamData = async () => {
            try {
                const response = await fetchFullDream(params.id)
                setDescription(response.dream.description || '')
                setTitle(response.dream.title || '') 
            } catch (err){
                console.log(err)
            } finally {
                setLoading(false)
            }
        }
        getDreamData()
    }, [params.id])
    
    if (loading) {
        return (
            <h1>Loading...</h1>
        )
    }

    return (
        <div className="flex flex-col gap-2 items-center">
            <button 
                onClick={() => router.back()} 
                className="flex items-center gap-2 text-md text-gray-600 hover:underline"
            >
                ← <span className="truncate max-w-[200px]">{title}</span>
            </button> 
            {/* Wrap component in a provider to avoid props drilling to sub components */}
            <AnalysesProvider dreamId={params.id} title={title} description={description}>
                <AnalysesView />
            </AnalysesProvider>
        </div>
    )
}