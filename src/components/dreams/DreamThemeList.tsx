export default function DreamThemeList ({themes}:{themes:string[]}) {
    const tagColors = [
        "bg-cyan-400",
        "bg-violet-400",
        "bg-yellow-200",
        "bg-pink-300",
        "bg-teal-300",
        "bg-indigo-400",
    ]

    return (
        <div className="absolute right-[-40px] top-10 flex flex-col gap-2">
            {themes.map((theme, index) => {
                const color = tagColors[Math.min(index, 5)]
                return (
                    <span
                        key={theme}
                        className={`${color} text-xs px-2 py-1 shadow-xl`}
                    >
                    {theme}
                    </span>
                )
            })}
        </div>
    )
}