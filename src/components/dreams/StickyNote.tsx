import { useEffect, useState } from "react";
import IconWithTooltip from "../ui/IconWithTooltip";
import { faNoteSticky as faNote, faX, faCheck,faArrowRotateLeft as faUndo } from "@fortawesome/free-solid-svg-icons";
import { useDreamView } from "@/contexts/DreamViewContext";
import StickyNoteContent from "./StickyNoteContent";
import { useScreenSize } from "@/app/hooks/useScreenSize";
import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

export default function StickyNote () {
    const {dream, submitNewNote} = useDreamView()
    const notes = dream.notes || ''
    const [showUndo, setShowUndo] = useState(false)
    const [newNote, setNewNote] = useState<string>(() => notes)
    
    const [showNote, setShowNote] = useState(notes !== '')
    const [showModal, setShowModal] = useState(false)
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
        setShowModal(false)
    }
    
    const handleUpdate = async () => {
        await submitNewNote(newNote)
        setSaved(true)
        setTimeout(() => {
            setShowUndo(false)
            setSaved(false)
            if (!newNote){
                setShowNote(false)
                setShowModal(false)
            }
        }, 2000)
    }
    const { isLargeAndAbove, isExtraSmall } = useScreenSize()
    
    if (isExtraSmall){
        return (
            <>
                <IconWithTooltip 
                    icon={faNote}
                    tooltipText={notes ? 'View Note': 'Add Note'}
                    extraClass="text-2xl text-yellow-300 hover:text-yellow-400"
                    onClick={() => setShowModal(true)}
                />
                <Dialog open={showModal} onClose={() => setShowModal(false)} className="relative z-50 ">
                
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

                <div className="fixed inset-0 flex items-end justify-center ">
                    <DialogPanel className="w-full max-w-md bg-white rounded-t-2xl p-6 shadow-xl bg-yellow-200 text-2xl">
                    <StickyNoteContent 
                        handleClose={handleClose}
                        showUndo={showUndo}
                        handleUpdate={handleUpdate}
                        handleUndoEditNote={handleUndoEditNote}
                        newNote={newNote}
                        handleNoteChange={handleNoteChange}
                        saved={saved}
                    />
                    </DialogPanel>
                    </div>
                </Dialog>
            </>
        )
    }

    return (
        <>{showNote?
                 <div className="absolute -bottom right-6 rotate-2 text-lg bg-yellow-200 p-3 shadow-lg rounded-sm w-40 lg:w-48 min-h-40 max-h-64 hover:-translate-y-1 hover:shadow-xl transition">
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-yellow-100 opacity-70 rounded-sm shadow-sm" />
                    <StickyNoteContent 
                        handleClose={handleClose}
                        showUndo={showUndo}
                        handleUpdate={handleUpdate}
                        handleUndoEditNote={handleUndoEditNote}
                        newNote={newNote}
                        handleNoteChange={handleNoteChange}
                        saved={saved}
                    />
                </div>
            :            
                <div className={!isExtraSmall ? "absolute bottom-4 right-6" : ""}>
                    <IconWithTooltip 
                        icon={faNote}
                        tooltipText={notes ? 'View Note': 'Add Note'}
                        extraClass="text-2xl text-yellow-300 hover:text-yellow-400"
                        onClick={() => setShowNote(true)}
                    />
                </div>}
        </>
    )
}

