"use client";
import { createContext, useState, useContext, useEffect } from "react"
import { DreamFullView } from "@/types/dreams"
import { fetchAiOptions } from "@/lib/api/aiAnalysis";
import { setterFunction } from "@/types/setterFunctions";
import { updateDream } from "@/lib/api/dreams";
import { useThemes } from "./ThemesContext";

type optionsType = {
    tone: string[],
    style: string[],
    length: string[]
}

type DreamViewContextType = {
    dream: DreamFullView,
    setDream: setterFunction<DreamFullView>,
    themes: string[]
    setThemes: setterFunction<string[]>,
    analysis: string
    setAnalysis: setterFunction<string>,
    tone: string,
    setTone: setterFunction<string>,
    style: string,
    setStyle: setterFunction<string>,
    length: string,
    setLength: setterFunction<string>,
    showSettings: boolean
    setShowSettings: setterFunction<boolean>,
    options: optionsType,
    peelingTheme: string | null,
    setPeelingTheme: setterFunction<string | null>,
    showBlankLabel: boolean,
    setShowBlankLabel: setterFunction<boolean>,
    removeTheme: (themeToRemove: string) => Promise<void>,
    addTheme: (newTheme: string) => Promise<void>,
    submitNewNote: (notes: string) => Promise<void>
}


const DreamViewContext = createContext<DreamViewContextType | null>(null)

export function DreamViewProvider({ children }:{ children: React.ReactNode}){

    const [dream, setDream] = useState<DreamFullView>({
        title: '', date: new Date(), owner: '', _id: '', __v: 0
    }) 
    const [themes, setThemes] = useState<string[]>([])
    const [analysis, setAnalysis] = useState('')

    const [options, setOptions] = useState<optionsType>({tone: [], style: [], length: []})

    const [tone, setTone] = useState<string>('')
    const [style, setStyle] = useState<string>('')
    const [length, setLength] = useState<string>('')
    const [showSettings, setShowSettings] = useState(false)
    const [peelingTheme, setPeelingTheme] = useState<string | null>(null)
    const [showBlankLabel, setShowBlankLabel] = useState(false)
    const { setRefetchThemes } = useThemes()

    useEffect(() => {
        const getAiOptions = async () => {
            const response = await fetchAiOptions()
            const options = response.options
            setOptions(response.options)
            setTone(options.tone[0])
            setStyle(options.style[0])
            setLength(options.length[0])
        }
        getAiOptions()
    }, [])

    // Function to save dream by coercing description and notes into type string | null
    // Allows DreamFullView type to be assigned to DreamUpdateType
    const saveDream = async (dream: DreamFullView, themes: string[]) => {
        await updateDream(dream._id, {
            dream: {
                ...dream,
                description: dream.description || null, 
                notes: dream.notes || null
            },
            themes
        })
    }

    // Helper function to update themes - used for both adding and removing themes
    const updateThemes = async (newThemes: string[]) => {
        await saveDream(dream, newThemes)
        setDream({...dream})
        setThemes(newThemes)
    }

    const removeTheme = async (themeToRemove: string) => {
        const themesToKeep = themes.filter(theme => theme !== themeToRemove)
        setPeelingTheme(themeToRemove) 
        await new Promise(res => setTimeout(res, 250))
        await updateThemes(themesToKeep)
        setPeelingTheme(null)
        setRefetchThemes(prev => !prev)
    }

    const addTheme = async (newTheme: string) => {
        setShowBlankLabel(false)  
        if (newTheme !== '' && !themes.includes(newTheme)){
            await updateThemes([...themes, newTheme])
            setRefetchThemes(prev => !prev)
        }

    }

    const submitNewNote = async (newNote: string) => {
        await saveDream({...dream, notes: newNote}, themes)
        setDream({...dream, notes: newNote || undefined})
    }

    return (
        <DreamViewContext.Provider value={{
            dream, 
            setDream, 
            themes, 
            setThemes, 
            analysis, 
            setAnalysis, 
            tone, 
            setTone,
            style,
            setStyle,
            length,
            setLength,
            showSettings, 
            setShowSettings,
            options,
            peelingTheme,
            setPeelingTheme,
            showBlankLabel,
            setShowBlankLabel,
            removeTheme,
            addTheme,
            submitNewNote
        }}>
            {children}
        </DreamViewContext.Provider>
    )
}

export function useDreamView(){
    const context = useContext(DreamViewContext)

    if (!context){
        throw new Error('useDreamView must be used within a DreamViewProvider')
    }

    return context   
}