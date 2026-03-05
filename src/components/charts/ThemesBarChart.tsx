import { useThemeChart } from "@/contexts/ThemeChartContext"
import { Tooltip, XAxis, BarChart, Bar} from "recharts"
import CustomTooltip from "@/components/charts/CustomTooltip"

export default function ThemesBarChart () {

    const { monthlyThemes, topThemes } = useThemeChart()
    
    const COLORS = [
        "#7f79f7",
        "#8bdbbc",
        "#a616f9",
        "#44c7ef",
        "#2203d6"
    ]

    if (monthlyThemes.length === 0 || topThemes.length === 0) return null

    return (
        <BarChart width={400} height={400} data={monthlyThemes} role='img' aria-label="themes-chart">
            <XAxis dataKey="month" />
            <Tooltip content={<CustomTooltip />}/>
            {topThemes.map((theme, index) => (
                <Bar key={theme} dataKey={theme} stackId="a" name={theme} fill={COLORS[index % COLORS.length]}/>
            ))}
        </BarChart>
    )
}