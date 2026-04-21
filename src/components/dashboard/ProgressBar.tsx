import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"

export default function HorizontalProgress({
    numerator,
    denominator
}: {
    numerator: number
    denominator: number
}) {
    const percentage = denominator ? (numerator / denominator) * 100 : 0

    const data = [
		{
			name: "progress",
			value: percentage,
			remaining: 100 - percentage,
		},
    ]

	const renderLabel = (props: any) => {
		const { x, y, width, height, value } = props

		if (width < 30) return null // hide if too small

		return (
			<text
				x={x + width - 5}
				y={y + height / 2}
				fill="white"
				textAnchor="end"
				dominantBaseline="middle"
				fontSize={12}
			>
				{Math.round(value)}%
			</text>
		)
	}

  	return (
		<ResponsiveContainer width="100%" height={30}>
			<BarChart
				width={300}
				height={30}
				data={data}
				layout="vertical"
			>
				<XAxis type="number" domain={[0, 100]} hide />
				<YAxis type="category" dataKey="name" hide />

				<Bar
					dataKey="value"
					stackId="a"
					fill="#7c3aed"
					radius={[10, 0, 0, 10]} // left rounded
					label={renderLabel} />

				<Bar
					dataKey="remaining"
					stackId="a"
					fill="#e5e7eb"
					radius={[0, 10, 10, 0]} // right rounded
				/>
			</BarChart>
		</ResponsiveContainer>
  	)
}