"use client";
import { createContext, Dispatch, SetStateAction, useState, useContext, useEffect } from "react"
import { DreamFullView } from "@/types/dreams"
import { ThemeResponse } from "@/types/themes"
import { fetchAiOptions } from "@/lib/api/aiAnalysis";

type optionsType = {
        tone: string[],
        style: string[],
        length: string[]
}

type DreamViewContextType = {
    dream: DreamFullView,
    setDream: Dispatch<SetStateAction<DreamFullView>>
    themes: ThemeResponse[]
    setThemes: Dispatch<SetStateAction<ThemeResponse[]>>
    analysis: string
    setAnalysis: Dispatch<SetStateAction<string>>
    tone: string,
    setTone: Dispatch<SetStateAction<string>>,
    style: string,
    setStyle: Dispatch<SetStateAction<string>>,
    length: string,
    setLength: Dispatch<SetStateAction<string>>,
    showSettings: boolean
    setShowSettings: Dispatch<SetStateAction<boolean>>,
    options: optionsType
}


const DreamViewContext = createContext<DreamViewContextType | null>(null)

export function DreamViewProvider({ children }:{ children: React.ReactNode}){

    const [dream, setDream] = useState<DreamFullView>({
        title: '', date: new Date(), owner: '', _id: '', __v: 0
    }) 
    const [themes, setThemes] = useState<ThemeResponse[]>([])
    const [analysis, setAnalysis] = useState('')

    const [options, setOptions] = useState<optionsType>({tone: [], style: [], length: []})

    const [tone, setTone] = useState<string>('')
    const [style, setStyle] = useState<string>('')
    const [length, setLength] = useState<string>('')
    const [showSettings, setShowSettings] = useState(false)

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
            options
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