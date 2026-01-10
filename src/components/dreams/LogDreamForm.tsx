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
    const [currentTheme, setCurrentTheme] = useState<string>('')
    const [themes, setThemes] = useState<string[]>([])
    const [msg, setMsg] = useState<string>('')

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMsg('')
        setDreamData({
            ...dreamData, [event.target.name ]: event.target.value
        })
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const result = await logNewDream({dream:dreamData, themes})
        if ('error' in result){
            return setMsg(result.error)
        }
        setMsg('Dream logged')
    }

    const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentTheme(event.target.value)
    }

    const addTheme = () => {
        if (currentTheme.trim() === '') return
        setThemes([...themes, currentTheme])
        setCurrentTheme('')
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
            <input 
                name='themes'
                value={currentTheme}
                onChange={handleThemeChange}
                placeholder="Themes"
            />
            {themes.length? themes.map((theme, index) => 
                <span key={index} className="bg-brand-softer border border-brand-subtle text-fg-brand-strong text-xs font-medium px-1.5 py-0.5 rounded">
                    {theme}
                </span>
            ) : null}
            {currentTheme !== '' && <button type='button' onClick={addTheme} className='bg-blue-300'>Add Theme</button>}
            {msg?? ''}
            <button onClick={handleSubmit} className='bg-blue-500 hover:bg-blue-700 text-white font-bold'>Save Dream</button>
        </form>
    )
}