import { Dispatch, MouseEventHandler, SetStateAction, useEffect, useState } from 'react'
import { DreamFormType } from "@/types/dreams";
import { ThemeBadge } from '@/components/ui/ThemeBadge';
import { fetchThemeSuggestions } from '@/lib/api/themes';
import { Input } from '../forms/Input';
import Button from '../forms/Button';
import { TextArea } from '../forms/TextArea';
import LinkWithMessage from '../forms/LinkWithMessage';

export default function DreamForm({ 
    dream, setDream, themes, setThemes, handleSubmit, msg, setMsg, handleGoBack, backText
}:{ 
    dream: DreamFormType, 
    setDream: Dispatch<SetStateAction<DreamFormType>>,
    themes: string[]
    setThemes: Dispatch<SetStateAction<string[]>>
    handleSubmit: (event:React.FormEvent) => Promise<any>,
    msg: string,
    setMsg: Dispatch<SetStateAction<string>>,
    handleGoBack: MouseEventHandler<HTMLButtonElement>
    backText: string
}){ 

    const [currentTheme, setCurrentTheme] = useState<string>('')
    const [suggestions, setSuggestions] = useState<string[]>([])
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false)

    const [visible, setVisible] = useState(false)
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setMsg('')
        setDream({
            ...dream, [event.target.name ]: event.target.value
        })
    }

    const handleChangeCurrentTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.trim()
        setCurrentTheme(value)
        setShowSuggestions(!suggestions.includes(value) && value !== '' && suggestions.length > 0)
        setMsg('')
        setVisible(!themes.includes(value) && value !== '')
    }

    const addTheme = () => {
        setThemes(prev => [currentTheme, ...prev])
        setCurrentTheme('')
        setMsg('')
        setVisible(false)
    }

    const removeTheme = (themeToRemove: string) => {
        setThemes(prev => prev.filter(theme => theme !== themeToRemove))
    }

    useEffect(() => {
        
        if (!currentTheme) {
            setSuggestions([])
            return
        }

        const timeout = setTimeout(async () => {
            try {
                const themeSuggestions =
                await fetchThemeSuggestions(currentTheme)
                const filtered = themeSuggestions.filter(
                    sugg => !themes.includes(sugg)
                )
                setSuggestions(filtered)
            } catch (err) {
                setSuggestions([])
            }
        }, 250)

        return () => clearTimeout(timeout)
    }, [currentTheme, themes])

    const handleClickSuggestion = (text: string) => {
        setShowSuggestions(false)
        setCurrentTheme(text)
    }

    // Dont allow date input to be in future
    const now = new Date().toISOString().split('T')[0]

    return (
        <form className="flex flex-col gap-2 max-w-3xl w-full" onSubmit={handleSubmit}>
            <Input 
                type='text'
                value={dream.title}
                name='title'
                onChange={handleChange}
                placeholder="Title"
            />
            <TextArea 
                className='h-40'
                value={dream.description}
                name='description'
                onChange={handleChange}
                placeholder="Description"
            />
            <Input 
                type='date'
                value={dream.date}
                name='date'
                onChange={handleChange}
                max={now}
            />
            <TextArea 
                className='h-20 flex flex-col placeholder-top'
                value={dream.notes}
                name='notes'
                onChange={handleChange}
                placeholder="Notes"
            />
            <Input 
                type='text'
                value={currentTheme}
                name='themes'
                onChange={handleChangeCurrentTheme}
                placeholder="Themes"
                disabled={dream.description === ''}
            />
            {showSuggestions && suggestions.map((sugg, index) => 
                <p 
                    className="text-xs text-gray-500" 
                    onClick={() => handleClickSuggestion(sugg)} 
                    key={index}
                >
                    {sugg}
                </p>
            )}
            {dream.description === '' && <p className="text-xs text-gray-500">
                Description must be provided to add themes.
            </p>}
            {!visible ? 
                null 
            : <Button color='bg-gray-400' text='Add Theme' type='button' onClick={addTheme} />}
            {themes.length? 
            <div className='inline'>
                {themes.map(theme => 
                    <ThemeBadge handleClick={() => removeTheme(theme)} currentTheme={theme} key={theme} />
                )}
            </div>:''}
            {msg ?? ''}
            <Button 
                type='submit' 
                text='Save'
            />
            <LinkWithMessage 
                href='/dreams'
                linkText='Back to Dashboard'
            />
        </form>
    )
}