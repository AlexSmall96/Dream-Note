
type TooltipPayloadItem = {
    name: string
    value: number
    color: string
}

type CustomTooltipProps = {
    active?: boolean
    payload?: TooltipPayloadItem[]
    label?: string
}

export default function CustomTooltip({
    active,
    payload,
    label,
}: CustomTooltipProps) {
    if (!active || !payload || payload.length === 0) {
        return null
    }

    return (
        <div data-testid="custom-tooltip" style={{ background: 'white', padding: 10, border: '1px solid #ccc' }}>
            <p><strong>{label}</strong></p>
            {payload.map((entry) => (
            <p key={entry.name} style={{ color: entry.color }}>
                {entry.name}: {entry.value}
            </p>
            ))}
        </div>
    )
}