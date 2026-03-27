"use client";
import DreamView from '@/components/dreams/DreamView'

export default function DreamPage({ params }: { params: { id: string } }) {

    return (
        <div className="flex flex-col items-center">
            <DreamView dreamId={params.id} />
        </div>
    )
}