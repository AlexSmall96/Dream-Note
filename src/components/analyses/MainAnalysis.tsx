import { Card } from "@/components/ui/Card";
import { SavedAnalysis } from "@/types/aiAnalysis";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { setterFunction } from "@/types/setterFunctions";
import { useScreenSize } from "@/app/hooks/useScreenSize";

export default function MainAnalysis({
    mainAnalysis, setShowMainAnalysis
}: {
    mainAnalysis: SavedAnalysis | null
    setShowMainAnalysis: setterFunction<boolean>
}) {

    const { isExtraLarge } = useScreenSize();
    
    return (
        <Card className="max-h-[50vh] overflow-y-auto scrollbar-custom">
            <p className='flex items-center justify-between gap-4'>
                    {!isExtraLarge && <button onClick={() => setShowMainAnalysis(false)}>Back to Analyses List</button>} 
                    <h1 className="text-lg font-semibold">Selected Analysis</h1>
                {mainAnalysis?.isFavorite && 
                <span className='text-xs text-gray-500 ml-auto'>Favourite
                    <FontAwesomeIcon icon={faHeart} className='text-purple-400 ml-1'/>
                </span>}
            </p>
            <p className='italic'>{mainAnalysis?.text}</p>
        </Card>
    )
}