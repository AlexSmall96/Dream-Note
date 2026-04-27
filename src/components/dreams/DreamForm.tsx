import { Dispatch, MouseEventHandler, SetStateAction, useEffect, useState } from 'react'
import { DreamFormType } from "@/types/dreams";
import { ThemeBadge } from '@/components/themes/ThemeBadge';
import { fetchThemeSuggestions } from '@/lib/api/themes';
import { Input } from '../forms/Input';
import Button from '../forms/Button';
import { TextArea } from '../forms/TextArea';
import LinkWithMessage from '../forms/LinkWithMessage';

export default function DreamForm({ 
    dream, setDream, themes, setThemes, handleSubmit, msg, setMsg, backHref, backText
}:{ 
    dream: DreamFormType, 
    setDream: Dispatch<SetStateAction<DreamFormType>>,
    themes: string[]
    setThemes: Dispatch<SetStateAction<string[]>>
    handleSubmit: (event:React.FormEvent) => Promise<any>,
    msg: string,
    setMsg: Dispatch<SetStateAction<string>>,
    backHref: string,
    backText: string
}){ 

    const [currentTheme, setCurrentTheme] = useState<string>('')
    const [suggestions, setSuggestions] = useState<string[]>([])
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false)
    const [themeDots, setThemeDots] = useState<string[]>(
        Array(themes.length).fill('text-purple-700').concat(Array(6 - themes.length).fill('text-purple-300'))
    )
    const [visible, setVisible] = useState(false)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setMsg('')
        setDream({
            ...dream, [event.target.name ]: event.target.value
        })
    }

    const handleChangeCurrentTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        const normalizedValue = value.toLowerCase()

        const normalizedSuggestions = suggestions.map(s => s.toLowerCase())
        const normalizedThemes = themes.map(t => t.toLowerCase())

        setCurrentTheme(value)
        setShowSuggestions(
            !normalizedSuggestions.includes(normalizedValue) &&
            value !== '' &&
            suggestions.length > 0
        )

        setMsg('')

        setVisible(
            !normalizedThemes.includes(normalizedValue) &&
            value !== ''
        )
    }

    const addTheme = () => {
        setThemes(prev => [currentTheme, ...prev])
        setThemeDots(prev => {
            const newDots = [...prev]
            newDots[themes.length] = 'text-purple-700'
            return newDots
        })
        setCurrentTheme('')
        setMsg('')
        setVisible(false)
    }

    const removeTheme = (themeToRemove: string) => {
        setThemes(prev => prev.filter(theme => theme !== themeToRemove))
        setThemeDots(prev => {
            const newDots = [...prev]
            newDots[themes.length - 1] = 'text-purple-300'
            return newDots
        })
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
                className='h-40 text-justify'
                value={dream.description.replace(/\n\s+/g, ' ').trim()}
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
                className='h-20 flex flex-col'
                value={dream.notes.replace(/\n\s+/g, ' ').trim()}
                name='notes'
                onChange={handleChange}
                placeholder="Notes"
            />
            <div className="relative w-full">
                <Input
                    type="text"
                    value={currentTheme}
                    name="themes"
                    onChange={handleChangeCurrentTheme}
                    placeholder="Themes"
                    disabled={dream.description === '' || themes.length >= 6}
                    className="pr-20"
                    maxLength={50}
                />
                {visible && (
                    <Button
                        type="button"
                        onClick={addTheme}
                        text='Add'
                        extraClass="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-sm"
                    />
                )}
            <div className={`absolute top-full left-0 w-full bg-white ${showSuggestions ? 'border border-gray-300' : ''} z-10 rounded`}>
                {showSuggestions && suggestions.map((sugg, index) => 
                    <p 
                        className="text-gray-500 px-2" 
                        onClick={() => handleClickSuggestion(sugg)} 
                        key={index}
                    >
                        {sugg}
                    </p>
                )}
            </div>
            </div>

            {dream.description === '' && <p className="text-xs text-gray-500">
                Description must be provided to add themes.
            </p>}
            {dream.description === '' && dream.title === '' && <p className="text-xs text-gray-500">
                Please provide a title or description to save the dream.
            </p>}
            {themes.length > 0 && <div className='grid lg:grid-cols-6 md:grid-cols-3 gap-2 pl-2'>
                <div className='md:col-span-3 lg:col-span-4'>
                    {themes.map(theme => 
                        <ThemeBadge handleClick={!showSuggestions ? () => removeTheme(theme) : () => {}} currentTheme={theme} key={theme} />
                    )}
                </div>
                <div className='md:col-span-3 lg:col-span-2 lg:flex lg:justify-end'>
                    <div className='flex items-center gap-2 ml-auto'>
                        {themeDots.map((dot, index) => <span className={`text-3xl ${dot}`} key={index}>•</span>)}
                        <span className='text-xs text-gray-400'>{themes.length} / 6 themes</span>
                    </div>
                </div>
            </div>}
            {msg ?? ''}
            <Button 
                type='submit' 
                text='Save'
                disabled={dream.description === '' && dream.title === ''}
                color={showSuggestions? 'bg-purple-200': undefined}
            />
            <LinkWithMessage 
                href={backHref}
                linkText={backText}
            />
        </form>
    )
}