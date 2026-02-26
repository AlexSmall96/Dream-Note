"use client";
import { useEffect, useState } from "react";
import { SavedAnalysis } from "@/types/aiAnalysis";
import { fetchSavedAnalyses, toggleFavoriteAnalysis } from "@/lib/api/aiAnalysis";
import Analysis from "@/components/dreams/Analysis";

export default function DreamAnalysisPage ({ params }: { params: { id: string } }) {

    const [analyses, setAnalyses] = useState<SavedAnalysis[]>([])
    
    useEffect(() => {
        const getSavedAnalyses = async () => {
            try {
                const response = await fetchSavedAnalyses(params.id)
                setAnalyses(response.analyses)
            } catch (err){
                console.log(err)
            }
        }
        getSavedAnalyses()
    }, [params.id])

    
    const toggleFavorite = async (analysisId: string) => {
        setAnalyses(prev =>  prev.map(a => a._id === analysisId ? {...a, isFavorite: !a.isFavorite} : a))
        try {
            await toggleFavoriteAnalysis(params.id, analysisId)
        } catch(err){
            setAnalyses(prev =>  prev.map(a => a._id === analysisId ? {...a, isFavorite: !a.isFavorite} : a))
        }
    }

    return (
        <div className="flex flex-col items-center m-4">
            <h1>Previous Analysis</h1>
            {analyses.length > 0 && analyses.map(
                analysis => 
                    <Analysis
                        key={analysis._id}
                        text={analysis.text} 
                        createdAt={analysis.createdAt.toString()} 
                        modelUsed={analysis.modelUsed} 
                        isFavourite={analysis.isFavorite}
                        onClickHeart={() => toggleFavorite(analysis._id)} 
                    />
            )}
        </div>
    )
}