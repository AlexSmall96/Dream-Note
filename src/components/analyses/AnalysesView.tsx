"use client";
import { useEffect, useState } from "react";
import { SavedAnalysis } from "@/types/aiAnalysis";
import { deleteAnalysis, fetchSavedAnalyses, toggleFavoriteAnalysis } from "@/lib/api/aiAnalysis";
import Analysis from "@/components/analyses/Analysis";
import Settings from "@/components/analyses/Settings";
import GenerateModal from "@/components/analyses/GenerateModal";
import { Card } from "@/components/ui/Card";
import { Tab, TabGroup, TabList } from '@headlessui/react'
import DescriptionSnapshot from "./DescriptionSnapshot";
import { useScreenSize } from '@/app/hooks/useScreenSize';
import { useAnalysesContext } from "@/contexts/AnalysesContext";
import LoadingSpinner from "../ui/LoadingSpinner";

export default function AnalysesView () {

    const { dreamId, showMainAnalysis, setShowMainAnalysis, setShowHeader } = useAnalysesContext();

    const [analyses, setAnalyses] = useState<SavedAnalysis[]>([])
    const [containsFav, setContainsFav] = useState(false)
    const [mainAnalysis, setMainAnalysis] = useState<SavedAnalysis | null>(null)
    const [refetchAnalyses, setRefetchAnalyses] = useState(false)
    const [filter, setFilter] = useState<'all' | 'favorites'>('all')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getSavedAnalyses = async () => {
            try {
                const response = await fetchSavedAnalyses(dreamId, filter)
                setAnalyses(response.analyses)
                setMainAnalysis(prev => prev || response.analyses[0] || null)
                setContainsFav(response.analyses.some(a => a.isFavorite))
                setShowHeader(response.analyses.length > 0)
            } catch (err){
                console.log(err)
            } finally {
                setLoading(false)
            }
        }
        getSavedAnalyses()
    }, [dreamId, refetchAnalyses, filter])

    useEffect(() => {
        setContainsFav(analyses.some(a => a.isFavorite))
    }, [analyses])
    
    const toggleFavorite = async (analysisId: string) => {
        setAnalyses(prev =>  prev.map(a => a._id === analysisId ? {...a, isFavorite: !a.isFavorite} : a))
        if (analysisId === mainAnalysis?._id) {
            setMainAnalysis(prev => ({...prev, isFavorite: !prev?.isFavorite || false} as SavedAnalysis))
        }
        try {
            await toggleFavoriteAnalysis(dreamId, analysisId)
        } catch(err){
            setAnalyses(prev =>  prev.map(a => a._id === analysisId ? {...a, isFavorite: !a.isFavorite} : a))
            if (analysisId === mainAnalysis?._id) {
                setMainAnalysis(prev => ({...prev, isFavorite: !prev?.isFavorite || false} as SavedAnalysis))
            }
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
        setShowMainAnalysis(false)
    }

    const viewFullAnalysis = (_id: string) => {
        setShowMainAnalysis(true)
        setMainAnalysis(analyses.filter(a => a._id === _id)[0])
    }

    const { isExtraLarge } = useScreenSize();

    if (loading) return <LoadingSpinner />
    
    return (
        <>          
            <div className='grid grid-cols-6 xl:gap-4'>
                <div className='col-span-6 xl:col-span-3'>
                    {(!showMainAnalysis || isExtraLarge) &&
                    <Card>
                        <div className="flex items-center justify-between mb-3">
                                {analyses.length > 0 && 
                                    (containsFav ? 
                                        <TabGroup>
                                            <TabList className="flex gap-1 bg-gray-100 p-1 rounded-full">
                                                <Tab 
                                                    onClick={() => setFilter('all')}
                                                    className="px-3 py-1 text-sm rounded-full data-[hover]:underline data-[selected]:bg-purple-400 data-[selected]:text-white">
                                                All
                                                </Tab>
                                                <Tab 
                                                    onClick={() => setFilter('favorites')}
                                                    className="px-3 py-1 text-sm rounded-full data-[hover]:underline data-[selected]:bg-purple-400 data-[selected]:text-white">
                                                Favourites
                                                </Tab>
                                            </TabList>
                                        </TabGroup>
                                    :                                
                                        <TabGroup>
                                            <TabList className="flex gap-1 bg-gray-100 p-1 rounded-full">
                                                <Tab className="px-3 py-1 text-sm rounded-full data-[hover]:underline data-[selected]:bg-purple-400 data-[selected]:text-white">
                                                    All
                                                </Tab>
                                            </TabList>
                                        </TabGroup>
                                    )
                                }
                            <div className="flex items-center gap-2">
                                {analyses.length === 0 && <p>No analyses saved yet. Click the wand to get started. →</p>}
                                <span className="flex items-center border border-gray-300 bg-gray-100 px-3 py-1 rounded-full gap-2">
                                    <GenerateModal setRefetchAnalyses={setRefetchAnalyses} />
                                    <Settings />
                                </span>
                            </div>
                        </div>
                        <div className="max-h-[70vh] overflow-y-auto pr-2 scrollbar-custom">
                            {analyses.length > 0 && analyses.map(analysis => 
                                <Analysis
                                    key={analysis._id}
                                    analysisData={analysis}
                                    onClickHeart={() => toggleFavorite(analysis._id)}
                                    onClickText={() => viewFullAnalysis(analysis._id)}
                                    onDelete={() => handleDelete(analysis._id)} 
                                    selected={mainAnalysis?._id === analysis._id}
                                    border
                                />
                                    
                            )}
                        </div>
                    </Card>}
                </div>
                {mainAnalysis && (showMainAnalysis || isExtraLarge) ? (
                    <div className='col-span-6 xl:col-span-3 flex flex-col gap-4'>
                        <Card>
                            <Analysis 
                                analysisData={mainAnalysis} 
                                onClickHeart={() => toggleFavorite(mainAnalysis._id)} 
                                onDelete={() => handleDelete(mainAnalysis._id)} 
                                selected={false} 
                                clamp={false}
                                textSize="text-md"
                            />
                        </Card>
                        <DescriptionSnapshot />
                    </div>
                ) : null}
            </div>
        </>
    )
}