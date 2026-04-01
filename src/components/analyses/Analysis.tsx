import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { DeleteModal } from "@/components/ui/DeleteModal";
import { SavedAnalysis } from "@/types/aiAnalysis";
import { useScreenSize } from '@/app/hooks/useScreenSize';
import { formatDate } from "@/lib/utils/formatDate";
import { useState } from "react";

export default function Analysis ({
    analysisData, onClickHeart, onClickText, onDelete, selected, clamp = true, textSize = 'text-sm'
}:{
    analysisData: SavedAnalysis,
    onClickHeart: () => Promise<void>,
    onClickText?: () => void,
    onDelete: () => Promise<void>
    selected: boolean
    clamp?: boolean
    textSize?: string
}) {
    const {tone, style, text, isFavorite, createdAt } = analysisData
    const formattedDate = formatDate(new Date(createdAt), true, true)
    const { isExtraLarge } = useScreenSize();

    const [animating, setAnimating] = useState(false)

    const handleClick = () => {
        if (!analysisData.isFavorite){
            setAnimating(true)
        }
        onClickHeart()
        setTimeout(() => setAnimating(false), 300)
    }

    return (
        <div className={`flex items-center p-2 ${selected && isExtraLarge? 'bg-gray-200': 'bg-white'} border-gray-200`}>
            <div className="flex-1 ml-2">
                <div className="text-gray-500 text-sm flex gap-4 mt-1 items-center justify-between">
                    <div className={`flex gap-2 ${textSize}`}>
                        <span>{formattedDate}</span>
                        <span>{`${tone} | ${style}`}</span>
                    </div>
                    <div className={`flex gap-4 items-center ${textSize}`}>
                        <FontAwesomeIcon 
                            icon={isFavorite ? solidHeart : regularHeart}
                            onClick={handleClick}
                            className={`cursor-pointer transition icon text-purple-400 ${animating ? "scale-125" : "scale-100"}`}
                        />
                        <DeleteModal 
                            handleDelete={onDelete}
                            message='Are you sure you want to delete this analysis?'
                        />
                    </div>
                </div>
                <div 
                    onClick={onClickText || undefined} 
                    className={`
                        text-gray-800 font-medium pr-2 text-justify italic
                        ${clamp ? 'line-clamp-3':'max-h-[300px] overflow-y-auto scrollbar-custom'} 
                        ${(!selected || !isExtraLarge) && onClickText ? 'hover:underline cursor-pointer' : ''}
                    `}
                >
                    {text}
                </div>
            </div>
        </div>        
    )
}