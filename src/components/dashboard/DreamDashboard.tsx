import DreamsLineChart from "@/components/dashboard/DreamsLineChart"
import ThemesBarChart from "../dashboard/ThemesBarChart"
import { useDreamCounts } from "@/contexts/DreamCountsContext"
import Image from "next/image"
import Button from "../forms/Button"
import { Card } from "../ui/Card"
import ProgressBar from "../dashboard/ProgressBar"

export default function DreamDashboard () {
    const { stats } = useDreamCounts()
	const { total, thisMonthTotal, noAnalysedDreams, oldestDreamDate} = stats

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
        <div className="space-y-4 mt-3">
            <Card className="bg-white/80 backdrop-blur p-4 border p-4 shadow-sm hover:shadow-md transition">
                <h1 className="text-xl font-semibold">Your Stats</h1>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                    <p className="text-sm text-gray-500">All Time</p>
                    <p className="text-2xl font-bold">{total}</p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Past 4 weeks</p>
                    <p className="text-2xl font-bold">{thisMonthTotal}</p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Analysed</p>
                    <p className="text-2xl font-bold">{noAnalysedDreams}</p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Oldest</p>
                    <p className="text-base font-medium">
                    {oldestDreamDate 
                        ? new Date(oldestDreamDate).toLocaleDateString() 
                        : 'N/A'}
                    </p>
                </div>
                </div>

                <div className="flex items-center gap-4 mt-4">
                <span className="text-sm text-gray-600">
                    Dreams analysed ratio
                </span>
                <ProgressBar
                    numerator={noAnalysedDreams} 
                    denominator={total} 
                />
                </div>
            </Card>

            <Card className="grid grid-cols-1 lg:grid-cols-2 gap-4 bg-white/80 backdrop-blur p-4 shadow-sm hover:shadow-md transition">
                <div className="border rounded-xl p-4 shadow-sm">
                    <h2 className="text-lg font-semibold mb-2">Dream Activity</h2>
                    <DreamsLineChart />
                </div>
                <div className="border rounded-xl p-4 shadow-sm">
                    <h2 className="text-lg font-semibold mb-2">Top Themes</h2>
                    <ThemesBarChart />
                </div>
            </Card>
        </div>
    )
}