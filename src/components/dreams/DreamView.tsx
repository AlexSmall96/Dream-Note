import { useThemesAside } from "@/contexts/ThemesAsideContext";
import DreamCard from "./DreamCard";
import { useDreamNavigation } from "@/app/hooks/useDreamNavigation";
import { faChevronRight as faNext } from "@fortawesome/free-solid-svg-icons";
import { faChevronLeft as faPrev } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export default function DreamView ({dreamId, created}:{dreamId:string, created: boolean}){
    const { goToNextDream, goToPrevDream, isFirst, isLast } = useDreamNavigation(dreamId)
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
            <DreamCard />
        </>
    )
}