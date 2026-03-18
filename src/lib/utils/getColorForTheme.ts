const tagColors = [
    "bg-cyan-400",
    "bg-violet-400",
    "bg-yellow-200",
    "bg-pink-300",
    "bg-teal-300",
    "bg-indigo-400",
]

const mutedColors = [
    "bg-cyan-200",
    "bg-violet-200",
    "bg-yellow-100",
    "bg-pink-200",
    "bg-teal-200",
    "bg-indigo-200",    
]

export const getColorForTheme = (theme: string, muted: boolean = false) => {
    let hash = 0
    for (let i = 0; i < theme.length; i++) {
        hash = theme.charCodeAt(i) + ((hash << 5) - hash)
    }
    const index = Math.abs(hash) % tagColors.length
    return muted ? mutedColors[index] : tagColors[index]
}