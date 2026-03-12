import { useDreamView } from "@/contexts/DreamViewContext"
import { useThemesAside } from "@/contexts/ThemesAsideContext";
import LinkWithMessage from "../forms/LinkWithMessage";
import { useParams } from "next/navigation"
import DreamCard from "./DreamCard";
import { fetchFullDream } from "@/lib/api/dreams";
import { useEffect, useState } from "react";
import { useDreamNavigation } from "@/app/hooks/useDreamNavigation";
import { faChevronRight as faNext } from "@fortawesome/free-solid-svg-icons";
import { faChevronLeft as faPrev } from "@fortawesome/free-solid-svg-icons";
import IconWithTooltip from "../ui/IconWithTooltip";


export default function DreamView ({dreamId}:{dreamId:string}){
    const { setDream, setThemes } = useDreamView()
    const params = useParams()
    const [loading, setLoading] = useState(true)
    const { index, goToNextDream, goToPrevDream, maxIndex } = useDreamNavigation(dreamId)
    const id = params.id as string

    useEffect(() => {
        const getFullDream = async () => {
            try {
                const response = await fetchFullDream(id)
                setDream(response.dream) 
                setThemes(response.themes || [])
                setLoading(false)
            } catch (err){
                console.log(err)
            }
        }
        getFullDream()
    }, [params.id])

    const { chronView } = useThemesAside()

    return (
        <div className="grid grid-cols-6">
            <div className='col-span-1 flex flex-col justify-center items-center'>
                {chronView && 
                    <IconWithTooltip 
                        onClick={goToPrevDream}
                        icon={faPrev}
                        tooltipText="Previous Dream"
                        extraClass={`text-2xl`}
                        disabled={index === 0}
                    />}
            </div>
            <div className="col-span-4 flex flex-col items-center">
                <LinkWithMessage 
                    href='/dreams'
                    linkText="Back to Dashboard"
                    extraClass="text-lg"
                />
                {loading ? 
                    <div className="flex justify-center items-center py-10">
                        <div className="w-6 h-6 border-2 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
                    </div>
                :
                        <DreamCard />
                }
            </div>
            <div className='col-span-1 flex flex-col justify-center items-center'>
                {chronView && 
                <IconWithTooltip
                    onClick={goToNextDream}
                    icon={faNext}
                    extraClass="text-2xl"
                    tooltipText="Next Dream"
                    disabled={index === maxIndex}
                />}
            </div>
        </div>
    )
}