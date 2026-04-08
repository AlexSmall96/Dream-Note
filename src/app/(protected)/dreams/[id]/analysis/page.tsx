"use client";
import AnalysesView from "@/components/analyses/AnalysesView";
import { AnalysesProvider } from "@/contexts/AnalysesContext";
import { fetchFullDream } from "@/lib/api/dreams";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useScreenSize } from '@/app/hooks/useScreenSize';

export default function DreamAnalysisPage ({ params }: { params: { id: string } }) {

    const [description, setDescription] = useState('')
    const [title, setTitle] = useState('')
    const [showMainAnalysis, setShowMainAnalysis] = useState(false)
    const { isExtraLarge } = useScreenSize();
    
    const router = useRouter()

    useEffect(() => {
        const getDreamData = async () => {
            try {
                const response = await fetchFullDream(params.id)
                setDescription(response.dream.description || '')
                setTitle(response.dream.title || '') 
            } catch (err){
                console.log(err)
            }
        }
        getDreamData()
    }, [params.id])
    
    return (
        <div className="flex flex-col mt-0">
            <div className="flex justify-between gap-2 w-full px-2 text-sm py-4 md:h-14 md:mb-1 md:text-md lg:text-lg w-auto xl:grid xl:grid-cols-6 xl:gap-6">
                <div className="flex flex-wrap items-center gap-1 text-gray-700 xl:col-span-3">
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

                    <div className="flex items-center gap-1 text-gray-700">
                        <button 
                            className="truncate max-w-[120px] hover:underline"
                            onClick={() => router.push(`/dreams/${params.id}`)}
                            
                            >{title}</button>
                        <span>/</span>
                        <button onClick={() => setShowMainAnalysis(false)} className={!showMainAnalysis || isExtraLarge ? "font-semibold" : "hover:underline"}>Analyses</button>
                        {showMainAnalysis && !isExtraLarge && 
                        <>
                            <span>/</span>
                            <span className="font-semibold">Selected Analysis</span>
                        </>
                        }
                        
                    </div>
                </div>
                {isExtraLarge && 
                    <div className="flex items-center font-semibold xl:col-span-3">Selected Analysis</div>
                }
            </div>
            
            {/* Wrap component in a provider to avoid props drilling to sub components */}
            <AnalysesProvider 
                dreamId={params.id} 
                title={title} 
                description={description} 
                showMainAnalysis={showMainAnalysis} 
                setShowMainAnalysis={setShowMainAnalysis} 
            >
                <AnalysesView  />
            </AnalysesProvider>
        </div>
    )
}