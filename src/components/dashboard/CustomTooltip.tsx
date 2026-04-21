export type TooltipPayloadItem = {
    name: string
    value: number
    color?: string
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
        <div role='tooltip' aria-label="custom-tooltip" style={{ background: 'white', padding: 10, border: '1px solid #ccc' }}>
            <p aria-label={label}><strong>{label}</strong></p>
            {payload.map((entry) => (
                <p key={entry.name} style={{ color: entry.color ?? "#100879" }} aria-label={entry.name}>
                    {entry.name}: {entry.value}
                </p>
            ))}
        </div>
    )
}