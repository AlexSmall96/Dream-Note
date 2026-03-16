import { useDreamView } from '@/contexts/DreamViewContext'
import { fetchAnalysis, saveNewAnalysis } from '@/lib/api/aiAnalysis'
import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState } from 'react'
import Button from '../forms/Button'


export default function GenerateModal() {

    const [isOpen, setIsOpen] = useState(false)
    const {dream, tone, style, length} = useDreamView()
    const description = dream.description || ''
    const [analysis, setAnalysis] = useState('')

    const getAnalysis = async () => {
        if (!description) return
        try {
            const response = await fetchAnalysis({
                description,
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
            await saveNewAnalysis(dream._id, {text: analysis, tone, style, length})
        } catch (err){
            console.log(err)
        }
    }

    const openModalAndGetAnalysis = async () => {
        setIsOpen(true)
        await getAnalysis()
    }
    
    return (
        <>
            <Button 
                type='button'
                onClick={openModalAndGetAnalysis}
                text='Generate New AI Analysis'
            />
            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
                        <DialogTitle className="font-bold">New Analysis </DialogTitle>
                        <span className="text-gray-500">{`${tone} | ${style} | ${length}`}</span>
                        <p className='font-bold'>Analysis:</p>
                        <p className='italic'>{analysis}</p>
                        <p className='font-semibold'>Description used:</p>
                        <p className="text-gray-500 text-sm flex gap-4 mt-1">{description}</p>
                        <div className="flex gap-4 items-center justify-center">
                            <button className='btn btn-gray bg-gray-300 p-1 m-1' onClick={() => setIsOpen(false)}>Discard</button>
                            <button className='bg-blue-300 p-1 m-1' onClick={saveAnalysis}>Save</button>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
            
        </>

    )

}