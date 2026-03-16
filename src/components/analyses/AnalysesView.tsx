"use client";
import { useEffect, useState } from "react";
import { SavedAnalysis } from "@/types/aiAnalysis";
import { deleteAnalysis, fetchSavedAnalyses, toggleFavoriteAnalysis, fetchAnalysis, saveNewAnalysis} from "@/lib/api/aiAnalysis";
import Analysis from "@/components/dreams/Analysis";
import { useRouter } from "next/navigation";
import Dropdown from "@/components/ui/Dropdown";
import { useDreamView } from "@/contexts/DreamViewContext";
import IconWithTooltip from "../ui/IconWithTooltip";
import { faGear as faSettings } from "@fortawesome/free-solid-svg-icons";

export default function AnalysesView ({dreamId}: {dreamId: string}) {

    const [analyses, setAnalyses] = useState<SavedAnalysis[]>([])
    const [mainAnalysis, setMainAnalysis] = useState<SavedAnalysis | null>(null)
    const { dream, options, tone, setTone, style, setStyle, length, setLength } = useDreamView()
    const [analysis, setAnalysis] = useState('')
    const [showSettings, setShowSettings] = useState(false)
    const router = useRouter()
    
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
    }, [dreamId])

    
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

    const getAnalysis = async () => {
        if (!dream.description) return
        try {
            const response = await fetchAnalysis({
                description: dream.description, 
                params: {
                    tone, style, length
                }
            })
            setAnalysis(response.analysis)
        } catch (err){
            console.log(err)
        }
    }

    const saveAnalysis = async () => {
        if (!analysis) return
        try {
            await saveNewAnalysis(dreamId, {text: analysis, tone, style, length})
        } catch (err){
            console.log(err)
        }
    }

    return (
        <>
            <button 
                onClick={getAnalysis}
                disabled={!dream.description}
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 disabled:cursor-not-allowed disabled:bg-gray-400'
            >
                Generate New Analysis 
            </button>
            <IconWithTooltip 
                onClick={() => setShowSettings(prev => !prev)} 
                icon={faSettings}
                tooltipText={`${!showSettings? 'Show': 'Hide'} settings`}
                extraClass="mx-2 text-xl"
            />
            {showSettings?
                    <>
                        <Dropdown<string> parameter={tone} setParameter={setTone} options={options.tone} parameterName="tone"/>
                        <Dropdown<string> parameter={style} setParameter={setStyle} options={options.style} parameterName="style" />                        
                        <Dropdown<string> parameter={length} setParameter={setLength} options={options.length} parameterName="length" />                        
                    </>
                :''}
                <p className="italic">{analysis ?? ''}</p>
            {analysis !== '' && 
                <button 
                    className='bg-green-500 hover:bg-green-700 text-white font-bold p-2 m-2 disabled:cursor-not-allowed disabled:bg-gray-400'
                    onClick={saveAnalysis}
                >
                    Save
                </button>
            }
            <div className='grid grid-cols-3 gap-4'>
                <div className='col-span-1'>
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
                    <button onClick={() => router.replace(`/dreams/${dreamId}`)} className='btn btn-gray bg-gray-300 p-1 m-2'>Back to Dream</button>
                </div>
                <div className='col-span-2'>
                    <p className='font-bold'>Analysis:</p>
                    <p className='italic'>{mainAnalysis?.text}</p>
                    <p className='font-semibold'>Description used:</p>
                    <p className="text-gray-500 text-sm flex gap-4 mt-1">{mainAnalysis?.descriptionSnapshot}</p>
                </div>
            </div>
        </>
    )
}