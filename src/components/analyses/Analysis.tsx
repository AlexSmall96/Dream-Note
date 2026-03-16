import { format } from "date-fns"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { DeleteModal } from "@/components/ui/DeleteModal";
import { SavedAnalysis } from "@/types/aiAnalysis";

export default function Analysis ({
    analysisData, onClickHeart, onClickText, onDelete, selected
}:{
    analysisData: SavedAnalysis,
    onClickHeart: () => Promise<void>,
    onClickText: () => void,
    onDelete: () => Promise<void>
    selected: boolean
}) {
    const {tone, style, text, isFavorite, createdAt } = analysisData
    const formattedDate = format(new Date(createdAt), "PP")

    return (
        <div className={`flex items-center p-4 border-b ${selected? 'bg-gray-200': ''} border-gray-200`}>
            <div className="flex-1 ml-2">
                <div 
                    onClick={onClickText} 
                    className={`text-gray-800 font-medium ${!selected && 'hover:underline cursor-pointer'} truncate max-w-xs`}
                >
                    {text}
                </div>
                <div className="text-gray-500 text-sm flex gap-4 mt-1">
                <span>{formattedDate}</span>
                <span>{`${tone} | ${style}`}</span>
                <FontAwesomeIcon
                    icon={isFavorite ? solidHeart : regularHeart}
                    onClick={onClickHeart}
                    className='cursor-pointer transition'
                />
                <DeleteModal 
                    handleDelete={onDelete}
                    message='Are you sure you want to delete this analysis?'
                />
                </div>
            </div>
        </div>        
    )
}