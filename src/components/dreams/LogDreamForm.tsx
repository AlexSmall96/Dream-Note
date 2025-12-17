"use client";
import { useState } from "react";
import { logNewDream } from "@/lib/api/dreams";

type Dream = {
    title?: string,
    description?: string,
    notes?: string
}

export default function LogDreamForm() {
    const [dreamData, setDreamData] = useState<Dream>({})
    const [msg, setMsg] = useState<string>('')

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMsg('')
        setDreamData({
            ...dreamData, [event.target.name ]: event.target.value
        })

    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const result = await logNewDream({dream:dreamData})
        if ('error' in result){
            return setMsg(result.error)
        }
        setMsg('Dream logged')
    }


    return (
        <form className="flex flex-col gap-2 w-80">
            <input
                name='title'
                value={dreamData.title}
                onChange={handleChange}
                placeholder="Title"
            />
            <input
                name='description'
                value={dreamData.description}
                onChange={handleChange}
                placeholder="Description"
            /> 
            <input
                name='notes'
                value={dreamData.notes}
                onChange={handleChange}
                placeholder="Notes"
            /> 
            {msg?? ''}
        <button onClick={handleSubmit} className='bg-blue-500 hover:bg-blue-700 text-white font-bold'>Save Dream</button>
        </form>
    )
}