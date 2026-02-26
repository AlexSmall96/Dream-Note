import { format } from "date-fns"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";

export default function Analysis ({
    text, createdAt, modelUsed, isFavourite, onClickHeart
}:{
    text: string,
    createdAt: string,
    modelUsed: string,
    isFavourite: boolean,
    onClickHeart: () => Promise<void>
}) {
    const formatted = format(new Date(createdAt), "PP")

    return (
        <div className="flex items-center p-4 border-b border-gray-200 hover:bg-gray-50 transition">
            <div className="flex-1 ml-2">
                <div className="text-gray-800 font-medium truncate max-w-xs">{text}</div>
                <div className="text-gray-500 text-sm flex gap-4 mt-1">
                <span>Created: {formatted}</span>
                <span>Model: {modelUsed}</span>
                <FontAwesomeIcon
                    icon={isFavourite ? solidHeart : regularHeart}
                    onClick={onClickHeart}
                    className='cursor-pointer transition'
                />
                </div>
            </div>
        </div>        
    )
}