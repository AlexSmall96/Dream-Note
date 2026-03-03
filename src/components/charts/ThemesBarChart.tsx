import { useStats } from "@/contexts/StatsContext"
import { Tooltip, XAxis, BarChart, Bar} from "recharts"

export default function ThemesBarChart () {

    const { monthlyThemes, topThemes } = useStats()

    const COLORS = [
        "#7f79f7",
        "#8bdbbc",
        "#a616f9",
        "#44c7ef",
        "#2203d6"
    ]

    return (
        <BarChart width={400} height={400} data={monthlyThemes}>
        <XAxis dataKey="month" />
        <Tooltip />
            {topThemes.map((theme, index) => (
                <Bar key={theme} dataKey={theme} stackId="a"  fill={COLORS[index % COLORS.length]}/>
            ))}
        </BarChart>
    )
}