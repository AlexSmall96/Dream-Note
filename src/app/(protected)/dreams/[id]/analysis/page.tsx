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
    const [showMainAnalysis, setShowMainAnalysis] = useState(false)
    
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
            <div className="flex items-center gap-2 w-full px-6 h-14">
            <button
                onClick={() => {
                    if (showMainAnalysis) {
                        setShowMainAnalysis(false) 
                    } else {
                        router.push(`/dreams/${params.id}`) 
                    }
                }}
                className="text-gray-600 hover:underline flex items-center gap-1"
            >
                ←
            </button>

            <div className="flex items-center gap-1 text-gray-700 truncate">
                <button 
                    className="truncate max-w-[120px] hover:underline"
                    onClick={() => router.push(`/dreams/${params.id}`)}
                    
                    >{title}</button>
                <span>/</span>
                <button onClick={() => setShowMainAnalysis(false)} className={!showMainAnalysis ? "font-semibold" : "hover:underline"}>Analyses</button>
                {showMainAnalysis &&<span>/</span>}
                {showMainAnalysis &&<span className="font-semibold">Selected Analysis</span>}
            </div>
            </div>
            {/* Wrap component in a provider to avoid props drilling to sub components */}
            <AnalysesProvider dreamId={params.id} title={title} description={description} >
                <AnalysesView showMainAnalysis={showMainAnalysis} setShowMainAnalysis={setShowMainAnalysis}/>
            </AnalysesProvider>
        </div>
    )
}