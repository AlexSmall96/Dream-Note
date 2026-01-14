"use client";
import { createContext, Dispatch, SetStateAction, useState, useContext } from "react"
import { DreamFullView } from "@/types/dreams"
import { ThemeResponse } from "@/types/themes"

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
    showSettings: boolean
    setShowSettings: Dispatch<SetStateAction<boolean>>,
    tones: string[],
    styles: string[]
}


const DreamViewContext = createContext<DreamViewContextType | null>(null)

export function DreamViewProvider({ children }:{ children: React.ReactNode}){

    const [dream, setDream] = useState<DreamFullView>({
        title: '', date: new Date(), owner: '', _id: '', __v: 0
    }) 
    const [themes, setThemes] = useState<ThemeResponse[]>([])
    const [analysis, setAnalysis] = useState('')

    const tones = [
        'Curious & intrigued', 'Caring & supportive', 'Excited and enthusiastic'
    ]

    const styles = [
        'Formal', 'Informal', 'Fantasy'
    ]

    const [tone, setTone] = useState<string>(tones[0])
    const [style, setStyle] = useState<string>(styles[0])
    const [showSettings, setShowSettings] = useState(false)

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
            showSettings, 
            setShowSettings,
            tones, 
            styles,
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