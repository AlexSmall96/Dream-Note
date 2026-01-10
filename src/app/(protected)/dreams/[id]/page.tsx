"use client";

import { useParams } from "next/navigation";
import DreamView from '@/components/dreams/DreamView'

export default function Dream() {
    const params = useParams()
    return (
        <div className="flex flex-col items-center m-4">
            <DreamView id={params.id.toString()} />
        </div>
    )
}