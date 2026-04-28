"use client";
import DreamView from '@/components/dreams/DreamView'
import { useSearchParams } from 'next/navigation'

export default function DreamPage({ params }: { params: { id: string } }) {
    const searchParams = useSearchParams()
    const created = searchParams.get('created')

    return (
        <div className="flex flex-col items-center overflow-hidden">           
            <DreamView dreamId={params.id} created={Boolean(created)} />
        </div>
    )
}