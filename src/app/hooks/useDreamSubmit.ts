import { useDreams } from '@/contexts/DreamsContext'
import { useState } from 'react'
import { logNewDream, updateDream } from '@/lib/api/dreams'

export function useDreamSubmit(){

    const [msg, setMsg] = useState<string>('')
    const { setDreams, setRefetch } = useDreams()

    const submitDream = async (payload: {
        id?: string
        title: string
        description: string | null
        notes: string | null
        date: Date
        themes? : string[]
    }) => {
        try {
            let result 
            if (payload.id){
                result = await updateDream(payload.id, {
                    dream: {
                        title: payload.title,
                        description: payload.description || null,
                        notes: payload.notes || null,
                        date: payload.date,
                    },
                    themes: payload.description ? payload.themes || [] : [],
                })
            } else {
                result = await logNewDream({
                    dream: {
                        title: payload.title || null,
                        description: payload.description || null,
                        notes: payload.notes || null,
                        date: payload.date,
                    },
                        themes: payload.description ? payload.themes || [] : [],
                })                
            }
            if ('error' in result) {
                setMsg(result.error)
                return { success: false, error: result.error }
            }  

            // Update dreams list
            const dreamOverview = {title: result.dream.title, date: result.dream.date, _id: result.dream._id} 
            setDreams(prev => [dreamOverview, ... prev.filter(dream => dream._id !==dreamOverview._id)])

            // Trigger refetch to sort dreams
            setRefetch(prev => !prev)
            setMsg(payload.id ? 'Dream updated' : 'Dream created')
            return { success: true, dream: result.dream }
        } catch (err){
            console.error(err)
            setMsg('Something went wrong')
            return { success: false, error: err }            
        }
    }

    return { submitDream, msg, setMsg }
}