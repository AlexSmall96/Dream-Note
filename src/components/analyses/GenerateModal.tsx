import { useDreamView } from '@/contexts/DreamViewContext'
import { fetchAnalysis, saveNewAnalysis } from '@/lib/api/aiAnalysis'
import { Dialog, DialogPanel, DialogBackdrop } from '@headlessui/react'
import { useEffect, useState } from 'react'
import Button from '@/components/forms/Button'
import { setterFunction } from '@/types/setterFunctions'
import IconWithTooltip from '../ui/IconWithTooltip'
import { faWandMagicSparkles as faGetAnalysis } from '@fortawesome/free-solid-svg-icons'
import { useAnalysesContext } from '@/contexts/AnalysesContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear as faSettings } from "@fortawesome/free-solid-svg-icons";

export default function GenerateModal({setRefetchAnalyses}:{setRefetchAnalyses: setterFunction<boolean>}) {

    const { dreamId, description } = useAnalysesContext()
    const [isOpen, setIsOpen] = useState(false)
    const { tone, style, length } = useDreamView()
    const [analysis, setAnalysis] = useState('')
    const [thinking, setThinking] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [thinkingText, setThinkingText] = useState('')

    const getAnalysis = async () => {
        setThinking(true)
        if (!description) {
            setThinkingText('No dream description found')
            return
        }
        try {
            const response = await fetchAnalysis({
                description,
                params: {
                    tone, style, length
                }
            })
            setAnalysis(response.analysis)
            setThinking(false)
        } catch (err){
            console.log(err)
        }
    }

    const saveAnalysis = async () => {
        if (!analysis) return
        try {
            setSaving(true)
            await saveNewAnalysis(dreamId, {text: analysis, tone, style, length})
        } catch (err){
            console.log(err)
        } finally {
            setSaving(false)
            setSaved(true)
            setRefetchAnalyses(prev => !prev)
        }
    }

    const openModalAndGetAnalysis = async () => {
        setThinking(true)
        setIsOpen(true)
        await getAnalysis()
    }
    
    const handleClose = () => {
        setAnalysis('')
        setIsOpen(false)
        setThinkingText('')
        setThinking(true)
        setSaving(false)
        setSaved(false)
    }

    useEffect(() => {
        if (isOpen && thinking){
            setThinkingText('Reading dream description')
            setTimeout(() => {
                setThinkingText('Analyzing dream description')
            }, 3000)
            setTimeout(() => {
                setThinkingText('Writing analysis')
            }, 6000)
        }
    }, [isOpen])


    if (!description){
        return (
            <p>Please add a description to your dream to generate AI analysis.</p>
        )
    }

    return (

        <>
            <IconWithTooltip 
                onClick={openModalAndGetAnalysis}
                tooltipText='Generate New AI Analysis'
                icon={faGetAnalysis}
                extraClass='text-violet-600'
            />
            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
                <DialogBackdrop className="fixed inset-0 bg-black/50" />
                <div className="fixed inset-0 flex w-screen items-center justify-center text-justify">
                    <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
                        
                        {thinking ? 
                            <p className='italic'>
                                <span className="flex gap-1">
                                    {thinkingText}
                                    <span className="animate-bounce [animation-delay:0ms]">.</span>
                                    <span className="animate-bounce [animation-delay:150ms]">.</span>
                                    <span className="animate-bounce [animation-delay:300ms]">.</span>
                                </span>
                            </p>
                        :
                            <>
                                <p className='font-bold'>Analysis:</p> 
                                <span className="text-gray-500">
                                    <FontAwesomeIcon icon={faSettings} className='text-sm'/>
                                    {` ${tone} | ${style} | ${length}`}
                                </span>
                                <p className='italic'>{analysis}</p>
                            </>}
                        <p className='font-semibold'>Dream:</p>
                        <p className="text-gray-500 text-lg flex gap-4 mt-1 font-caveat max-h-[30vh] overflow-y-auto">{description}</p>
                        <div className="flex gap-4 items-center justify-center border-t pt-4">
                            {!saved?
                            <>
                                <Button 
                                    color='bg-gray-400 hover:bg-gray-600' 
                                    disabled={saving} 
                                    onClick={handleClose}
                                    text={thinking? 'Close' : 'Discard'}
                                />
                                {!thinking && 
                                <Button 
                                    onClick={saveAnalysis}
                                    disabled={saving}
                                    text={saving? 'Saving...' : 'Save'}
                                />}
                            </>
                            : 
                            <>
                                Analysis Saved <span className='text-green-400'>✓</span> 
                                <Button onClick={handleClose} text='View all analyses' />
                            </>
                                }
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
            
        </>

    )

}