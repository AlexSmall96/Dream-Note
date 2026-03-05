import DreamsLineChart from "@/components/charts/DreamsLineChart"
import ThemesBarChart from "../charts/ThemesBarChart"
import { useDreamCounts } from "@/contexts/DreamCountsContext"

export default function DreamDashboard () {
    const { stats } = useDreamCounts()
	const { total, thisMonthTotal } = stats

    return (
        <>
            <h1>Totals Dreams Recorded:</h1>
            <p>All Time: {total}</p>
            <p>Past 4 weeks: {thisMonthTotal}</p>
            <DreamsLineChart />
            <ThemesBarChart />
        </>
    )
}