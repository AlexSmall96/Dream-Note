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
        <div className="flex flex-col mt-0">
            <div className="flex items-center justify-between w-full px-6 h-10 pt-2">
            <button 
                onClick={() => router.back()} 
                className="flex items-center gap-2 text-md text-gray-600 hover:underline"
            >
                ← <span className="truncate max-w-[200px]">{title}</span>
            </button> 

            <h1 className="text-lg font-semibold text-center flex-1">
                Analyses
            </h1>

            <div className="w-[200px]">{/* empty div to balance back button */}</div>
            </div>
            {/* Wrap component in a provider to avoid props drilling to sub components */}
            <AnalysesProvider dreamId={params.id} title={title} description={description}>
                <AnalysesView />
            </AnalysesProvider>
        </div>
    )
}