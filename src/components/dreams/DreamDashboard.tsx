import DreamsLineChart from "@/components/charts/DreamsLineChart"
import ThemesBarChart from "../charts/ThemesBarChart"
import { useDreamCounts } from "@/contexts/DreamCountsContext"
import Image from "next/image"
import Button from "../forms/Button"

export default function DreamDashboard () {
    const { stats } = useDreamCounts()
	const { total, thisMonthTotal } = stats

    if (total === 0){
        return (
            <div className="flex flex-col items-center gap-1 py-10 px-2 text-center">
                <Image
                    src="/images/book.png"
                    alt="Open book illustration"
                    width={200}
                    height={200}
                    className="opacity-50"
                />
                <h2 className="text-lg font-semibold">No dreams recorded yet</h2>
                <p className="text-gray-500">
                   Record your dreams to see insights and trends here!</p>
                <Button
                    onClick={() => window.location.href = '/dreams/create'}
                    text="Click here to get started"
                    extraClass="mt-2"
                />
            </div>
        )
    }
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