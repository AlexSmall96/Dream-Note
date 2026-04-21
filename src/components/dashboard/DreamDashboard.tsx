import DreamsLineChart from "@/components/dashboard/DreamsLineChart"
import ThemesBarChart from "../dashboard/ThemesBarChart"
import { useDreamCounts } from "@/contexts/DreamCountsContext"
import { Card } from "../ui/Card"
import ProgressBar from "../dashboard/ProgressBar"
import { useThemeChart } from "@/contexts/ThemeChartContext"

export default function DreamDashboard () {
    const { stats } = useDreamCounts()
	const { total, thisMonthTotal, noAnalysedDreams, oldestDreamDate} = stats
    const { topThemes } = useThemeChart()

    const COLORS = [
        "#7f79f7",
        "#8bdbbc",
        "#a616f9",
        "#44c7ef",
        "#2203d6"
    ]

    const themeColors = topThemes.reduce((acc, theme, index) => {
        acc[theme] = COLORS[index % COLORS.length]
        return acc
    }, {} as Record<string, string>)

    return (
        <>
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

            <Card className="grid grid-cols-1 lg:grid-cols-4 gap-4 bg-white/80 backdrop-blur p-4 shadow-sm hover:shadow-md transition">
                <div className="col-span-1 lg:col-span-2 border rounded-xl p-4 shadow-sm bg-gray-100">
                    <h2 className="text-lg font-semibold mb-2">Dream Activity</h2>
                    <DreamsLineChart />
                </div>
                <div className="col-span-1 lg:col-span-2 border rounded-xl p-4 shadow-sm bg-gray-100">
                    <h2 className="text-lg font-semibold mb-2">
                        Top Themes
                    </h2>
                    <div className="flex flex-wrap gap-x-1 gap-y-1 font-caveat font-normal">
                        {topThemes.length > 0 && topThemes.map(theme => (
                            <span key={theme} className="block mr-1 max-w-[100px] truncate" style={{ color: themeColors[theme] }}>{theme}</span>
                        ))}
                    </div>
                    <ThemesBarChart colors={COLORS} />
                </div>
            </Card>
        </>
    )
}