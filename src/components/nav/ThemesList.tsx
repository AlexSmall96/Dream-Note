import { useThemesAside } from "@/contexts/ThemesAsideContext"
import { useThemes } from "@/contexts/ThemesContext"
import { getColorForTheme } from "@/lib/utils/getColorForTheme"
import { getUniqueThemes } from "@/lib/utils/getUniqueThemes"

export default function ThemesList () {

    const { themes, counts } = useThemes()
    const uniqueThemes = getUniqueThemes(themes)
    const {selectedTheme, setSelectedTheme} = useThemesAside()

    return (
        <div className='max-h-64 overflow-y-auto overflow-x-hidden mb-1 grid grid-cols-3 gap-1 pr-1.5'>
            {uniqueThemes.map(theme =>
                <div key={theme}>
                    <button 
                        className={`${getColorForTheme(theme, selectedTheme !== theme)} 
                            w-full p-1 shadow-sm border-l-2 border-black/20 flex items-center gap-1`}
                        onClick={() => setSelectedTheme(theme)}
                    >
                        <span className="text-sm truncate flex-1">
                            {theme}
                        </span>
                        <span className="text-sm text-gray-500 flex-shrink-0">
                            ({counts[theme]})
                        </span>
                    </button>
                </div> 
            )}
        </div>
    )
}