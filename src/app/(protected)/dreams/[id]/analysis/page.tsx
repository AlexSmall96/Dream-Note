"use client";
import { useEffect, useState } from "react";
import { SavedAnalysis } from "@/types/aiAnalysis";
import { deleteAnalysis, fetchSavedAnalyses, toggleFavoriteAnalysis } from "@/lib/api/aiAnalysis";
import Analysis from "@/components/dreams/Analysis";
import { useRouter } from "next/navigation";

export default function DreamAnalysisPage ({ params }: { params: { id: string } }) {

    const [analyses, setAnalyses] = useState<SavedAnalysis[]>([])
    const [mainAnalysis, setMainAnalysis] = useState<SavedAnalysis | null>(null)

    const router = useRouter()
    
    useEffect(() => {
        const getSavedAnalyses = async () => {
            try {
                const response = await fetchSavedAnalyses(params.id)
                setAnalyses(response.analyses)
                setMainAnalysis(response.analyses[0])
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

    const handleDelete = async (analysisId: string) => {
        try {
            await deleteAnalysis(params.id, analysisId)
        } catch (err) {
            console.log(err)
        }
        setAnalyses(prev => prev.filter(a => a._id !== analysisId))
    }

    const viewFullAnalysis = (_id: string) => {
        setMainAnalysis(analyses.filter(a => a._id === _id)[0])
    }
    
    return (
        <>
            <h1>Previous Analysis</h1>
            <div className='grid grid-cols-2 gap-4'>
                <div>
                    {analyses.length > 0 && analyses.map(
                        analysis => 
                            <Analysis
                                analysisData={analysis}
                                onClickHeart={() => toggleFavorite(analysis._id)}
                                onClickText={() => viewFullAnalysis(analysis._id)}
                                onDelete={() => handleDelete(analysis._id)} 
                                selected={mainAnalysis?._id === analysis._id}
                            />
                    )}
                    <button onClick={() => router.replace(`/dreams/${params.id}`)} className='btn btn-gray bg-gray-300 p-1 m-2'>Back to Dream</button>
                </div>
                <div>
                    <p className='font-bold'>Analysis:</p>
                    <p className='italic'>{mainAnalysis?.text}</p>
                    <p className='font-semibold'>Description used:</p>
                    <p className="text-gray-500 text-sm flex gap-4 mt-1">{mainAnalysis?.descriptionSnapshot}</p>
                </div>
            </div>
        </>
    )
}