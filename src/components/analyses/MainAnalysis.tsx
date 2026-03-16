import { Card } from "@/components/ui/Card";
import { SavedAnalysis } from "@/types/aiAnalysis";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

export default function MainAnalysis({mainAnalysis}: {mainAnalysis: SavedAnalysis | null}) {
    return (
        <>
            <Card>
                    <p className='flex items-center justify-between gap-4'>
                <span className='font-bold'> 
                    Analysis:
                </span> 
                {mainAnalysis?.isFavorite && 
                <span className='text-xs text-gray-500 ml-auto'>Favourite
                    <FontAwesomeIcon icon={faHeart} className='text-purple-400 ml-1'/>
                </span>}
                </p>
                <p className='italic'>{mainAnalysis?.text}</p>
                </Card>
                <Card className="bg-[url('/images/paper.jpg')]">
                    <p className='font-semibold mt-2'>Description used:</p>
                    <p className="mt-1 text-lg font-caveat">{mainAnalysis?.descriptionSnapshot}</p>
            </Card>        
        </>
    )
}