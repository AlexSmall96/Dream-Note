import { Dispatch, MouseEventHandler, SetStateAction, useState } from 'react'
import { DreamFormType } from "@/types/dreams";
import { ThemeBadge } from '../ui/ThemeBadge';

export default function DreamForm({ 
    dream, setDream, themes, setThemes, handleSubmit, msg, setMsg
}:{ 
    dream: DreamFormType, 
    setDream: Dispatch<SetStateAction<DreamFormType>>,
    themes: string[]
    setThemes: Dispatch<SetStateAction<string[]>>
    handleSubmit: (event:React.FormEvent) => Promise<any>,
    msg: string,
    setMsg: Dispatch<SetStateAction<string>>
}){ 

    const [currentTheme, setCurrentTheme] = useState<string>('')

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMsg('')
        setDream({
            ...dream, [event.target.name ]: event.target.value
        })
    }

    const handleChangeCurrentTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentTheme(event.target.value.trim())
    }

    const addTheme = () => {
        setThemes(prev => [currentTheme, ...prev])
        setCurrentTheme('')
    }

    const removeTheme = (themeToRemove: string) => {
        setThemes(prev => prev.filter(theme => theme !== themeToRemove))
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
            <input 
                type='text'
                value={currentTheme}
                name='themes'
                onChange={handleChangeCurrentTheme}
                placeholder="Themes"
                disabled={dream.description === ''}
            />
            {dream.description === '' && <p className="text-xs text-gray-500">
                Description must be provided to add themes.
            </p>}
            {currentTheme === '' ? 
                null 
            : 
                <button className='bg-blue-300' type='button' onClick={addTheme}>
                    Add Theme
                </button>}
            {themes.length? 
            <div className='inline'>
                {themes.map(theme => 
                    <ThemeBadge handleClick={() => removeTheme(theme)} currentTheme={theme} key={theme} />
                )}
            </div>:''}
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