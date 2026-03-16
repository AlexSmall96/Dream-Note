"use client";
import { useEffect, useState } from "react";
import { SavedAnalysis } from "@/types/aiAnalysis";
import { deleteAnalysis, fetchSavedAnalyses, toggleFavoriteAnalysis } from "@/lib/api/aiAnalysis";
import Analysis from "@/components/analyses/Analysis";
import LinkWithMessage from "../forms/LinkWithMessage";
import Settings from "./Settings";
import GenerateModal from "./GenerateModal";

export default function AnalysesView ({dreamId}: {dreamId: string}) {

    const [analyses, setAnalyses] = useState<SavedAnalysis[]>([])
    const [mainAnalysis, setMainAnalysis] = useState<SavedAnalysis | null>(null)
    const [refetchAnalyses, setRefetchAnalyses] = useState(false)

    useEffect(() => {
        const getSavedAnalyses = async () => {
            try {
                const response = await fetchSavedAnalyses(dreamId)
                setAnalyses(response.analyses)
                setMainAnalysis(response.analyses[0])
            } catch (err){
                console.log(err)
            }
        }
        getSavedAnalyses()
    }, [dreamId, refetchAnalyses])

    
    const toggleFavorite = async (analysisId: string) => {
        setAnalyses(prev =>  prev.map(a => a._id === analysisId ? {...a, isFavorite: !a.isFavorite} : a))
        try {
            await toggleFavoriteAnalysis(dreamId, analysisId)
        } catch(err){
            setAnalyses(prev =>  prev.map(a => a._id === analysisId ? {...a, isFavorite: !a.isFavorite} : a))
        }
    }

    const handleDelete = async (analysisId: string) => {
        try {
            await deleteAnalysis(dreamId, analysisId)
        } catch (err) {
            console.log(err)
        }
        const remaining = analyses.filter(a => a._id !== analysisId)
        setAnalyses(remaining)
        setMainAnalysis(remaining[0])
    }

    const viewFullAnalysis = (_id: string) => {
        setMainAnalysis(analyses.filter(a => a._id === _id)[0])
    }

    return (
        <>          
            <LinkWithMessage
                href={`/dreams/${dreamId}`}
                linkText="Back to Dream"
            />
            <div className='flex items-center justify-center gap-4 my-4'>
                <GenerateModal setRefetchAnalyses={setRefetchAnalyses} />
                <Settings />
            </div>
            <div className='grid grid-cols-3 gap-4'>
                <div className='col-span-1'>
                        {analyses.length > 0 &&
                        <> 
                        <h1>Your saved Analysis</h1>
                        {analyses.map(
                            analysis => 
                                <Analysis
                                    analysisData={analysis}
                                    onClickHeart={() => toggleFavorite(analysis._id)}
                                    onClickText={() => viewFullAnalysis(analysis._id)}
                                    onDelete={() => handleDelete(analysis._id)} 
                                    selected={mainAnalysis?._id === analysis._id}
                                />
                        )}
                        </>}
                </div>
                <div className='col-span-2'>
                    <p className='font-bold'>Analysis:</p>
                    <p className='italic'>{mainAnalysis?.text}</p>
                    <p className='font-semibold'>Description used:</p>
                    <p className="text-gray-500 flex gap-4 mt-1 text-lg font-caveat">{mainAnalysis?.descriptionSnapshot}</p>
                </div>
            </div>
        </>
    )
}