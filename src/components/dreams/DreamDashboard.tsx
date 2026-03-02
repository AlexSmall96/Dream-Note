import { useDreams } from "@/contexts/DreamsContext"
import DreamsLineChart from "@/components/charts/DreamsLineChart"

export default function DreamDashboard () {
    const { stats } = useDreams()
	const { total, thisMonthTotal } = stats

    return (
        <>
            <h1>Totals Dreams Recorded:</h1>
            <p>All Time: {total}</p>
            <p>Past 4 weeks: {thisMonthTotal}</p>
            <DreamsLineChart />
        </>
    )
}