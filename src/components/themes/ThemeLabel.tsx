import { useDreamView } from '@/contexts/DreamViewContext'

export default function ThemeLabel ({
    theme, 
    color, 
    isPeeling,
    index
}:{ theme:string,
    color: string,
    isPeeling: boolean,
    index: number
}){

    const { removeTheme } = useDreamView()

    return (
        <span
            key={theme}
            style={{ transform: `translateY(${index * 2}px)` }}
            className={`font-caveat group flex items-center gap-1 ${color} px-3 py-1 shadow-md border-l-4 border-black/20
                    transition-all duration-200
                    ${isPeeling ? "translate-x-6 -rotate-12 opacity-0 scale-90" : "hover:-translate-x-1 hover:shadow-lg"}`}
        >
            {theme}
        <button 
            className="text-lg text-gray-700 rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition"
            onClick={() => removeTheme(theme)}
        >    
            x
        </button>
        </span>
    )
}