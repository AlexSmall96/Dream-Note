import { useDreamChart } from "@/contexts/DreamChartContext"
import { LineChart, Tooltip, XAxis, CartesianGrid, Line } from "recharts"

export default function DreamsLineChart () {

    const { dreamCounts } = useDreamChart()

    return (
        <LineChart width={400} height={400} data={dreamCounts} margin={{ top: 20, right: 20, bottom: 40, left: 20 }}>
            <XAxis dataKey="label" />
            <Tooltip />
            <CartesianGrid stroke="#f5f5f5" />
            <Line type="monotone" dataKey="dreams" stroke="#100879" />
        </LineChart>
    )
}