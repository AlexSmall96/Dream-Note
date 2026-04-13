import { faNoteSticky as faNote, faX, faCheck,faArrowRotateLeft as faUndo } from "@fortawesome/free-solid-svg-icons";
import IconWithTooltip from "../ui/IconWithTooltip";
import { useScreenSize } from "@/app/hooks/useScreenSize";

export default function StickyNoteContent ({
    handleClose,
    showUndo,
    handleUpdate,
    handleUndoEditNote,
    newNote,
    handleNoteChange,
    saved
}:{
    handleClose: () => void,
    showUndo: boolean,
    handleUpdate: () => void,
    handleUndoEditNote: () => void,
    newNote: string,
    handleNoteChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void,
    saved: boolean
}) {
    const { isExtraSmall } = useScreenSize()
    
    return (
        <>
            <div className={!isExtraSmall ? "absolute top-2 right-2 flex gap-1" : "justify-end flex gap-1 mb-4"}>
                <IconWithTooltip 
                    tooltipText='Close' 
                    icon={faX} 
                    extraClass="text-xs hover:cursor-pointer" 
                    onClick={handleClose}
                />
                {showUndo && 
                <IconWithTooltip 
                    tooltipText='Keep Changes' 
                    icon={faCheck} 
                    extraClass={`text-xs hover:cursor-pointer ${saved ? 'text-green-500 animate-pulse' :''}`}
                    onClick={handleUpdate}
                />}
                {showUndo && 
                <IconWithTooltip 
                    tooltipText='Undo Changes' 
                    icon={faUndo} 
                    extraClass="text-xs hover:cursor-pointer" 
                    onClick={handleUndoEditNote}
                />}                        
            </div>
            <form className={`${isExtraSmall ? 'w-full' : 'absolute left-1 bottom-1 flex gap-1'}`}>
                <textarea 
                    value={newNote || ''}
                    onChange={handleNoteChange}
                    className={`${isExtraSmall ? 'w-full' : 'w-30 lg:w-44'} h-32 px-2 bg-yellow-200 focus:outline-none text-gray-800 resize-none overflow-y-hidden font-caveat`}
                />
            </form>        
        </>

    )
}