import { useState } from "react";
import { logNewDream, updateDream } from "@/lib/api/dreams";
import { Dispatch, SetStateAction } from 'react'
import { DreamFormType } from "@/types/dreams";
import { useRouter } from "next/navigation";
import { useDreams } from "@/contexts/DreamsContext";

export default function DreamForm({ 
    dream, setDream, id
}:{ dream: DreamFormType, setDream: Dispatch<SetStateAction<DreamFormType>>, id?: string}){ 

    const [msg, setMsg] = useState<string>('')
    const router = useRouter();

    const { setDreams } = useDreams()

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMsg('')
        setDream({
            ...dream, [event.target.name ]: event.target.value
        })    
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        const result = id ? await updateDream(id, {dream, themes: []}) : await logNewDream({dream, themes: []}) 
        if ('error' in result){
            return setMsg(result.error)
        }
        console.log(result)
        const dreamOverview = {title: result.dream.title, date: result.dream.date, _id: result.dream._id}
        setDreams(prev => [dreamOverview, ... prev])
        setMsg('Dream logged')
    }

    return (
        <form className="flex flex-col gap-2 w-80">
            <input 
                type='text'
                value={dream.title}
                name='title'
                onChange={handleChange}
                placeholder="Title"
            />
            <input 
                type='text'
                value={dream.description}
                name='description'
                onChange={handleChange}
                placeholder="Description"
            />
            <input 
                type='text'
                value={dream.notes}
                name='notes'
                onChange={handleChange}
                placeholder="Notes"
            />
            {msg ?? ''}
            <button 
                type='submit' 
                onClick={handleSubmit}
                className='bg-blue-500' 
            >
                Save
            </button>
        </form>
    )
}