import { useThemeChart } from "@/contexts/ThemeChartContext"
import { Tooltip, XAxis, BarChart, Bar, ResponsiveContainer} from "recharts"
import CustomTooltip from "@/components/dashboard/CustomTooltip"

export default function ThemesBarChart ({colors}: {colors?: string[]}) {

    const { monthlyThemes, topThemes } = useThemeChart()


    if (monthlyThemes.length === 0 || topThemes.length === 0) return null

    return (
        <ResponsiveContainer width="100%" height={340} className='mt-1'>
            <BarChart data={monthlyThemes} role='img' aria-label="themes-chart">
                <XAxis dataKey="month" />
                <Tooltip content={<CustomTooltip />}/>
                {topThemes.map((theme, index) => (
                    <Bar key={theme} dataKey={theme} stackId="a" name={theme} fill={colors ? colors[index % colors.length] : "#7f79f7"}/>
                ))}
            </BarChart>
        </ResponsiveContainer>
    )
}