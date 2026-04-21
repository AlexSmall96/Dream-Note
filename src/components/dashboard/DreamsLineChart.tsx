import { useDreamChart } from "@/contexts/DreamChartContext"
import { LineChart, Tooltip, XAxis, CartesianGrid, Line, ResponsiveContainer } from "recharts"
import CustomTooltip from "./CustomTooltip"

export default function DreamsLineChart () {

    const { dreamCounts } = useDreamChart()

    if (dreamCounts.length === 0) return null

    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart 
                data={dreamCounts} 
                role='img' 
                aria-label='dream-line-chart' 
                margin={{ top: 20, right: 20, bottom: 40, left: 20 }}
            >
                <XAxis dataKey="label" />
                <Tooltip content={<CustomTooltip  />}/>
                <CartesianGrid stroke="#f5f5f5" />
                <Line type="monotone" dataKey="dreams" stroke="#100879" />
            </LineChart>
        </ResponsiveContainer>
    )
}