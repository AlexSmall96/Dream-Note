"use client";
import { useEffect, useState } from "react";
import { SavedAnalysis } from "@/types/aiAnalysis";
import { deleteAnalysis, fetchSavedAnalyses, toggleFavoriteAnalysis } from "@/lib/api/aiAnalysis";
import Analysis from "@/components/analyses/Analysis";
import Settings from "@/components/analyses/Settings";
import GenerateModal from "@/components/analyses/GenerateModal";
import { Card } from "@/components/ui/Card";
import MainAnalysis from "@/components/analyses/MainAnalysis";
import { Tab, TabGroup, TabList } from '@headlessui/react'
import DescriptionSnapshot from "./DescriptionSnapshot";
import { useScreenSize } from '@/app/hooks/useScreenSize';
import { useAnalysesContext } from "@/contexts/AnalysesContext";

export default function AnalysesView () {

    const { dreamId } = useAnalysesContext();

    const [analyses, setAnalyses] = useState<SavedAnalysis[]>([])
    const [mainAnalysis, setMainAnalysis] = useState<SavedAnalysis | null>(null)
    const [showMainAnalysis, setShowMainAnalysis] = useState(false)
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
        setShowMainAnalysis(true)
        setMainAnalysis(analyses.filter(a => a._id === _id)[0])
    }

    const { isExtraLarge } = useScreenSize();

    return (
        <>          
            <div className='flex items-center justify-between gap-4 my-4'>
                <div className='flex items-center gap-4 mr-6'>
                    <h1 className="text-lg font-semibold">
                        Analyses
                    </h1>
                    <GenerateModal setRefetchAnalyses={setRefetchAnalyses} />
                    <Settings />
                </div>
            </div>
            <div className='grid grid-cols-6 gap-1'>
                <div className='col-span-6 xl:col-span-3'>
                    {analyses.length > 0 && (!showMainAnalysis || isExtraLarge) &&
                    <Card>
                        <div className="flex items-center justify-between mb-3">
                            <h1 className="text-lg font-semibold">Saved Analyses</h1>
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
                {showMainAnalysis || isExtraLarge ? (
                    <div className='col-span-6 xl:col-span-3'>
                        <MainAnalysis mainAnalysis={mainAnalysis} setShowMainAnalysis={setShowMainAnalysis}/>
                        <DescriptionSnapshot />
                    </div>
                ) : null}
            </div>
        </>
    )
}