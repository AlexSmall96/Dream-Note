"use client";

import { useDreamView } from "@/contexts/DreamViewContext";
import { deleteDream } from "@/lib/api/dreams";
import { useState } from "react";
import DeleteDream from "@/components/dreams/DeleteDream";
import { useDreams } from "@/contexts/DreamsContext";

export default function DeleteDreamPage ({
  	params,
}: {
  	params: { id: string };
}){
    const { dream } = useDreamView()
    const id = params.id
    const [msg, setMsg] = useState<string>(`Are you sure you want to remove the dream: ${dream.title}?`)
    const [visible, setVisible] = useState<boolean>(true)
    const [deleted, setDeleted] = useState<boolean>(false)
    const [waiting, setWaiting] = useState<boolean>(false)
    const [backUrl, setBackUrl] = useState<string>(`/dreams/${id}/`)
    const { setDreams } = useDreams()

    const handleDelete = async () => {
        setWaiting(true)
        try {
            await deleteDream(id)
            setMsg(`Removed the dream ${dream.title}.`)
            setDeleted(true)
            setBackUrl(`/dreams`)
            setDreams(prev => prev.filter(dream => dream._id !== id))
        } catch (err){
            console.log(err)
            setMsg('Unable to remove dream')
        }
        setVisible(false)
        setWaiting(false)
    }

    return (
        <DeleteDream msg={msg} visible={visible} deleted={deleted} backUrl={backUrl} handleDelete={handleDelete} waiting={waiting} />
    )
}   