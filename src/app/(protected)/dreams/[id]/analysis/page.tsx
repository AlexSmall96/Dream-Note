"use client";
import AnalysesView from "@/components/analyses/AnalysesView";

export default function DreamAnalysisPage ({ params }: { params: { id: string } }) {


    return (
        <AnalysesView dreamId={params.id} />
    )
}