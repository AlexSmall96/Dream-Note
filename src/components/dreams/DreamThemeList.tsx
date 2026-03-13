import { getColorForTheme } from "@/lib/utils/getColorForTheme"

export default function DreamThemeList ({
    themes, 
    removeTheme, 
    peelingTheme
}:{
    themes:string[], 
    removeTheme: (theme: string) => Promise<void>, 
    peelingTheme: string | null
}) {

    return (
        <div className="absolute right-[-50px] top-16 flex flex-col gap-2">
            {themes.map((theme) => {
                const color = getColorForTheme(theme)
                const isPeeling = peelingTheme === theme
                return (
                    <span
                        key={theme}
                        className={`
                                    group flex items-center gap-1 ${color} text-xs px-3 py-1 shadow-md border-l-4 border-black/20
                                    transition-all duration-200
                                    ${isPeeling ? "translate-x-6 -rotate-12 opacity-0 scale-90" : "hover:-translate-x-1 hover:shadow-lg"}
                                `}
                    >
                    {theme}
                    <button 
                        className="text-xs text-gray-700 rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition"
                        onClick={() => removeTheme(theme)}
                    >    
                        x
                    </button>
                    </span>
                )
            })}
        </div>
    )
}