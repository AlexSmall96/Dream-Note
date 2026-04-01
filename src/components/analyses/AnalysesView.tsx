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
import { setterFunction } from "@/types/setterFunctions";

export default function AnalysesView ({showMainAnalysis, setShowMainAnalysis}: {showMainAnalysis: boolean, setShowMainAnalysis: setterFunction<boolean>}) {

    const { dreamId } = useAnalysesContext();

    const [analyses, setAnalyses] = useState<SavedAnalysis[]>([])
    const [mainAnalysis, setMainAnalysis] = useState<SavedAnalysis | null>(null)
    const [refetchAnalyses, setRefetchAnalyses] = useState(false)

    const [filter, setFilter] = useState<'all' | 'favorites'>('all')

    useEffect(() => {
        const getSavedAnalyses = async () => {
            try {
                const response = await fetchSavedAnalyses(dreamId, filter)
                setAnalyses(response.analyses)
                setMainAnalysis(response.analyses[0])
            } catch (err){
                console.log(err)
            }
        }
        getSavedAnalyses()
    }, [dreamId, refetchAnalyses, filter])

    
    const toggleFavorite = async (analysisId: string) => {
        setAnalyses(prev =>  prev.map(a => a._id === analysisId ? {...a, isFavorite: !a.isFavorite} : a))
        setMainAnalysis(prev => ({...prev, isFavorite: !prev?.isFavorite || false} as SavedAnalysis))
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
        setShowMainAnalysis(false)
    }

    const viewFullAnalysis = (_id: string) => {
        setShowMainAnalysis(true)
        setMainAnalysis(analyses.filter(a => a._id === _id)[0])
    }

    const { isExtraLarge } = useScreenSize();

    return (
        <>          
            <div className='grid grid-cols-6 gap-1'>
                <div className='col-span-6 xl:col-span-3'>
                    {analyses.length > 0 && (!showMainAnalysis || isExtraLarge) &&
                    <Card>
                        <div className="flex items-center justify-between mb-3">
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
                            <div className="flex items-center gap-2" >
                                <span className="flex items-center border border-gray-300 bg-gray-100 px-3 py-1 rounded-full gap-2">
                                    <GenerateModal setRefetchAnalyses={setRefetchAnalyses} />
                                    <Settings />
                                </span>

                            </div>
                        </div>
                        <div className="max-h-[70vh] overflow-y-auto pr-2">
                            {analyses.map(analysis => 
                                <Analysis
                                    key={analysis._id}
                                    analysisData={analysis}
                                    onClickHeart={() => toggleFavorite(analysis._id)}
                                    onClickText={() => viewFullAnalysis(analysis._id)}
                                    onDelete={() => handleDelete(analysis._id)} 
                                    selected={mainAnalysis?._id === analysis._id}
                                />
                            )}
                        </div>
                    </Card>}
                </div>
                {mainAnalysis && (showMainAnalysis || isExtraLarge) ? (
                    <div className='col-span-6 xl:col-span-3 flex flex-col gap-4'>
                        <Analysis 
                            analysisData={mainAnalysis} 
                            onClickHeart={() => toggleFavorite(mainAnalysis._id)} 
                            onDelete={() => handleDelete(mainAnalysis._id)} 
                            selected={false} 
                            clamp={false}
                        />
                        <DescriptionSnapshot />
                    </div>
                ) : null}
            </div>
        </>
    )
}