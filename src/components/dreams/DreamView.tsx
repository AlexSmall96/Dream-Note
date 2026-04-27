import { useDreamView } from "@/contexts/DreamViewContext"
import { useThemesAside } from "@/contexts/ThemesAsideContext";
import { useParams } from "next/navigation"
import DreamCard from "./DreamCard";
import { fetchFullDream } from "@/lib/api/dreams";
import { useEffect, useState } from "react";
import { useDreamNavigation } from "@/app/hooks/useDreamNavigation";
import { faChevronRight as faNext } from "@fortawesome/free-solid-svg-icons";
import { faChevronLeft as faPrev } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export default function DreamView ({dreamId, created}:{dreamId:string, created: boolean}){
    const { setDream, setThemes } = useDreamView()
    const params = useParams()
    const [loading, setLoading] = useState(true)
    const { goToNextDream, goToPrevDream, isFirst, isLast } = useDreamNavigation(dreamId)
    const id = params.id as string

    useEffect(() => {
        const getFullDream = async () => {
            try {
                const response = await fetchFullDream(id)
                setDream(response.dream) 
                setThemes(response.themes?.map(t => t.theme) || [])
                setLoading(false)
            } catch (err){
                console.log(err)
            }
        }
        getFullDream()
    }, [params.id])

    const { chronView } = useThemesAside()

    return (
        <>
            <div className="header-content">
                    {chronView && !isFirst &&
                        <span 
                            className="mr-20 text-gray-400 hover:text-gray-700 transition hover:-translate-x-1 cursor-pointer"
                            onClick={goToPrevDream}
                        >
                             <FontAwesomeIcon icon={faPrev} className="text-md"/>
                        </span>
                    }
                    {chronView && !isLast &&
                        <span 
                            className="ml-20 text-gray-400 hover:text-gray-700 transition hover:translate-x-1 cursor-pointer"
                            onClick={goToNextDream}
                        >
                            <FontAwesomeIcon icon={faNext} className="text-md"/> 
                        </span>}
                    {created && (
                        <div className="text-purple-400 px-3 py-1 ml-4">
                            Dream created
                        </div>
                    )}
            </div>
                {loading ? 
                    <div className="flex justify-center items-center py-10">
                        <div className="w-6 h-6 border-2 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
                    </div>
                :
                        <DreamCard />
                }
        </>
    )
}