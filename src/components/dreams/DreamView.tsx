import Dropdown from "@/components/ui/Dropdown"
import { useDreamView } from "@/contexts/DreamViewContext"
import { useThemesAside } from "@/contexts/ThemesAsideContext";
import { useRouter } from "next/navigation";
import LinkWithMessage from "../forms/LinkWithMessage";
import { useParams } from "next/navigation"
import DreamCard from "./DreamCard";
import { fetchFullDream } from "@/lib/api/dreams";
import { useEffect } from "react";
import { useDreamAnalysis } from "@/app/hooks/useDreamAnalysis";
import { useDreamNavigation } from "@/app/hooks/useDreamNavigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight as faNext } from "@fortawesome/free-solid-svg-icons";
import { faChevronLeft as faPrev } from "@fortawesome/free-solid-svg-icons";

export default function DreamView ({dreamId}:{dreamId:string}){
    const { dream, setDream, setThemes, analysis, showSettings, setShowSettings, tone, setTone, style, setStyle, length, setLength, options } = useDreamView()
    const params = useParams()
    const { getAnalysis, saveAnalysis } = useDreamAnalysis(dreamId)
    const { index, goToNextDream, goToPrevDream, maxIndex } = useDreamNavigation(dreamId)
    const id = params.id as string

    useEffect(() => {
        const getFullDream = async () => {
            try {
                const response = await fetchFullDream(id)
                setDream(response.dream) 
                setThemes(response.themes || [])
            } catch (err){
                console.log(err)
            }
        }
        getFullDream()
    }, [params.id])

    const { chronView } = useThemesAside()
    const router = useRouter()


    return (
        <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center">
            {chronView &&
                <span>
                    {index !== 0 && 
                    <button onClick={goToPrevDream} className='bg-gray-200 px-2 py-1 m-1'>
                        <FontAwesomeIcon icon={faPrev} />
                    </button>}
                    {index !== maxIndex && 
                    <button onClick={goToNextDream} className='bg-gray-200 px-2 py-1 m-1'>
                        <FontAwesomeIcon icon={faNext} />
                    </button>}
                </span>}
            <DreamCard />

            <p className="italic">{analysis ?? ''}</p>
            {analysis !== '' && 
                <button 
                    className='bg-green-500 hover:bg-green-700 text-white font-bold p-2 m-2 disabled:cursor-not-allowed disabled:bg-gray-400'
                    onClick={saveAnalysis}
                >
                    Save
                </button>
            }
            <LinkWithMessage 
                href='/dreams'
                linkText="Back to Dashboard"
            />
        </div>
        <div className="flex flex-col items-center">
            <button 
                onClick={getAnalysis}
                disabled={!dream.description}
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 disabled:cursor-not-allowed disabled:bg-gray-400'
            >
                Analyse
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
        </div>
        </div>
    )
}