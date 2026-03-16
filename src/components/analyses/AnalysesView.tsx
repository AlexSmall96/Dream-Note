"use client";
import { useEffect, useState } from "react";
import { SavedAnalysis } from "@/types/aiAnalysis";
import { deleteAnalysis, fetchSavedAnalyses, toggleFavoriteAnalysis } from "@/lib/api/aiAnalysis";
import Analysis from "@/components/analyses/Analysis";
import LinkWithMessage from "@/components/forms/LinkWithMessage";
import Settings from "@/components/analyses/Settings";
import GenerateModal from "@/components/analyses/GenerateModal";
import { Card } from "@/components/ui/Card";
import { fetchFullDream } from '@/lib/api/dreams'
import MainAnalysis from "@/components/analyses/MainAnalysis";
import { Tab, TabGroup, TabList } from '@headlessui/react'

export default function AnalysesView ({dreamId}: {dreamId: string}) {

    const [analyses, setAnalyses] = useState<SavedAnalysis[]>([])
    const [mainAnalysis, setMainAnalysis] = useState<SavedAnalysis | null>(null)
    const [refetchAnalyses, setRefetchAnalyses] = useState(false)
    const [description, setDescription] = useState('')
    const [title, setTitle] = useState('')

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

    useEffect(() => {
        const getDreamData = async () => {
            try {
                const response = await fetchFullDream(dreamId)
                setDescription(response.dream.description || '')
                setTitle(response.dream.title || '') 
            } catch (err){
                console.log(err)
            }
        }
        getDreamData()
    }, [dreamId])

    return (
        <>          

            <div className='flex items-center justify-between gap-4 my-4'>
            <LinkWithMessage
                href={`/dreams/${dreamId}`}
                linkText="Back to Dream"
                extraClass="ml-6"
            />
                <h1 className='text-2xl font-bold flex-1 text-center'>{title}</h1>
                <div className='flex items-center gap-4 mr-6'>
                    <GenerateModal setRefetchAnalyses={setRefetchAnalyses} description={description} />
                    <Settings />
                </div>
            </div>
            <div className='grid grid-cols-5 gap-4'>
                <div className='col-span-2'>
                    {analyses.length > 0 &&
                    <Card>
                        <div className="flex items-center justify-between mb-3">
                            <h1 className="text-lg font-semibold">Saved Analyses</h1>
                            <TabGroup>
                                <TabList className="flex gap-1 bg-gray-100 p-1 rounded-full">
                                    <Tab className="px-3 py-1 text-sm rounded-full data-[hover]:underline data-[selected]:bg-blue-500 data-[selected]:text-white">
                                    All
                                    </Tab>
                                    <Tab className="px-3 py-1 text-sm rounded-full data-[hover]:underline data-[selected]:bg-blue-500 data-[selected]:text-white">
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
                <div className='col-span-3'>
                    <MainAnalysis mainAnalysis={mainAnalysis} />
                </div>
            </div>
        </>
    )
}