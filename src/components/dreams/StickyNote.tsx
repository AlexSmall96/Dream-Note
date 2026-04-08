import { useState } from "react";
import IconWithTooltip from "../ui/IconWithTooltip";
import { faNoteSticky as faNote, faX, faCheck,faArrowRotateLeft as faUndo } from "@fortawesome/free-solid-svg-icons";
import { useDreamView } from "@/contexts/DreamViewContext";

export default function StickyNote () {
    const {dream, submitNewNote} = useDreamView()
    const notes = dream.notes || ''
    const [showUndo, setShowUndo] = useState(false)
    const [newNote, setNewNote] = useState<string>(() => notes)
    const [showNote, setShowNote] = useState(notes !== '')
    const [saved, setSaved] = useState(false)

    const handleNoteChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewNote(e.target.value)
        setShowUndo(true)
    }

    const handleUndoEditNote = () => {
        setNewNote(notes || '')
        setShowUndo(false)
    }

    const handleClose = () => {
        setShowNote(false)
    }
    
    const handleUpdate = async () => {
        await submitNewNote(newNote)
        setSaved(true)
        setTimeout(() => {
            setShowUndo(false)
            setSaved(false)
            if (!newNote){
                setShowNote(false)
            }
        }, 2000)
    }

    return (
        <>{showNote?
                <div className="absolute -bottom right-6 rotate-2 bg-yellow-200 p-3 shadow-lg rounded-sm w-40 lg:w-48 min-h-40 max-h-64 hover:-translate-y-1 hover:shadow-xl transition">
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-yellow-100 opacity-70 rounded-sm shadow-sm" />
                    <div className="absolute top-2 right-2 flex gap-1">
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
                    <form className="absolute left-1 bottom-1 flex gap-1">
                        <textarea 
                            value={newNote || ''}
                            onChange={handleNoteChange}
                            className="w-30 lg:w-44 h-32 px-2 bg-yellow-200 focus:outline-none text-lg text-gray-800 resize-none overflow-y-hidden"
                        />
                    </form>
                </div>
            :            
                <div className="absolute bottom-4 right-6">
                    <IconWithTooltip 
                        icon={faNote}
                        tooltipText={notes ? 'View Note': 'Add Note'}
                        extraClass="text-2xl text-yellow-300 hover:text-yellow-400"
                        onClick={() => setShowNote(true)}
                    />
                </div>
        }</>
    )
}

