"use client";
import DreamForm from "@/components/dreams/DreamForm";
import { logNewDream } from "@/lib/api/dreams";
import { DreamFormType } from "@/types/dreams";
import { useState } from "react";


export default function LogNewDream() {
    const [dream, setDream] = useState<DreamFormType>({})
    
    return (
        <div className="flex flex-col items-center m-4">
            <DreamForm dream={dream} setDream={setDream} />
        </div>
    )
}