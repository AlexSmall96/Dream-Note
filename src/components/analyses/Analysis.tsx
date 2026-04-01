import { format } from "date-fns"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { DeleteModal } from "@/components/ui/DeleteModal";
import { SavedAnalysis } from "@/types/aiAnalysis";

export default function Analysis ({
    analysisData, onClickHeart, onClickText, onDelete, selected, clamp = true
}:{
    analysisData: SavedAnalysis,
    onClickHeart: () => Promise<void>,
    onClickText?: () => void,
    onDelete: () => Promise<void>
    selected: boolean
    clamp?: boolean
}) {
    const {tone, style, text, isFavorite, createdAt } = analysisData
    const formattedDate = format(new Date(createdAt), "PP")

    return (
        <div className={`flex items-center p-2 border-b ${selected? 'bg-gray-200': 'bg-white'} border-gray-200`}>
            <div className="flex-1 ml-2">
                <div className="text-gray-500 text-sm flex gap-4 mt-1 items-center justify-between">
                    <div className="flex gap-2">
                        <span>{formattedDate}</span>
                        <span>{`${tone} | ${style}`}</span>
                    </div>
                    <div className="flex gap-4 items-center">
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
                <div 
                    onClick={onClickText || undefined} 
                    className={`text-gray-800 font-medium pr-2 text-justify ${clamp ? 'line-clamp-3':'max-h-[300px] overflow-y-auto scrollbar-custom'} ${!selected && onClickText ? 'hover:underline cursor-pointer' : ''}`}
                >
                    {text}
                </div>
            </div>
        </div>        
    )
}