import Dropdown from "@/components/ui/Dropdown"
import { useDreamView } from "@/contexts/DreamViewContext"
import { useThemesAside } from "@/contexts/ThemesAsideContext";
import { useRouter } from "next/navigation";

export default function DreamView ({
    getAnalysis,
    saveAnalysis, 
    onNext, 
    onPrev, 
    index,
    maxIndex,
    id
}:{
    getAnalysis: () => Promise<void>, 
    saveAnalysis: () => Promise<void>, 
    onNext: () => void,
    onPrev: () => void,
    index: number,
    maxIndex: number,
    id: string
}){

    const {dream, themes, analysis, showSettings, setShowSettings, tone, setTone, style, setStyle, length, setLength, options } = useDreamView()
    const { chronView } = useThemesAside()
    const router = useRouter()

    return (
        <div className="flex flex-col items-center">
            <h1>{dream.title}</h1>
            <h1>{new Date(dream.date).toLocaleDateString()}</h1>
            <p>{dream.description}</p>
            <p>{dream.notes}</p>
            {themes.map(theme =>
                <span key={theme.theme} className="bg-brand-softer border border-brand-subtle text-fg-brand-strong text-xs font-medium px-1.5 py-0.5 rounded">
                    {theme.theme}
                </span>
                )}
            <p className="italic">{analysis ?? ''}</p>
            {analysis !== '' && 
                <button 
                    className='bg-green-500 hover:bg-green-700 text-white font-bold p-2 m-2 disabled:cursor-not-allowed disabled:bg-gray-400'
                    onClick={saveAnalysis}
                >
                    Save
                </button>
            }
            <button 
                onClick={getAnalysis}
                disabled={!dream.description}
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 disabled:cursor-not-allowed disabled:bg-gray-400'
            >
                Get New AI Analysis
            </button>
            <button 
                onClick={() => setShowSettings(prev => !prev)} 
                className='bg-cyan-500 text-white font-bold p-2 m-2'
            >
                {!showSettings? 'Show': 'Hide'} settings  
            </button>
            {showSettings?
                    <>
                        <Dropdown<string> parameter={tone} setParameter={setTone} options={options.tone} parameterName="tone"/>
                        <Dropdown<string> parameter={style} setParameter={setStyle} options={options.style} parameterName="style" />                        
                        <Dropdown<string> parameter={length} setParameter={setLength} options={options.length} parameterName="length" />                        
                    </>
                :''}
            <button className='bg-blue-400 p-2 m-1' onClick={() => router.replace(`/dreams/${id}/analysis`)}>
                View Previous AI Analysis
            </button>
            <button className='bg-blue-300 p-1 m-1' onClick={() => router.replace(`/dreams/${id}/edit`)}>Edit</button>
            <button className='bg-green-300 p-1 m-1' onClick={() => router.replace(`/dreams/${id}/delete`)}>Delete</button>
            <button className='bg-gray-300 p-1 m-1' onClick={() => router.replace(`/dreams/`)}>Back to Dashboard</button>
            {chronView &&
            <span>
                {index !== 0 && <button onClick={onPrev} className='bg-gray-200 px-2 py-1 m-1'>Previous dream</button>}
                {index !== maxIndex && <button onClick={onNext} className='bg-gray-200 px-2 py-1 m-1'>Next dream</button>}
            </span>}
        </div>
    )
}