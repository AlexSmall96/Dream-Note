"use client";

import DreamDashboard from "@/components/dreams/DreamDashboard";
import { useDreams } from "@/contexts/DreamsContext";

export default function Dreams() {
	const { stats } = useDreams()
	const { total, thisMonthTotal } = stats
    return (
		<div className="flex flex-col items-center">
			<DreamDashboard total={total} totalPastMonth={thisMonthTotal} />
		</div>
    );
}