import { useThemesAside } from "@/contexts/ThemesAsideContext"
import { useThemes } from "@/contexts/ThemesContext"
import { getColorForTheme } from "@/lib/utils/getColorForTheme"
import { getUniqueThemes } from "@/lib/utils/getUniqueThemes"

export default function ThemesList () {

    const { themes, counts } = useThemes()
    const uniqueThemes = getUniqueThemes(themes)
    const {selectedTheme, setSelectedTheme} = useThemesAside()

    return (
        <div className='max-h-64 overflow-y-auto grid grid-cols-3 gap-1'>
            {uniqueThemes.map(theme =>
                <div key={theme}>
                    <button 
                        className={`${getColorForTheme(theme, selectedTheme !== theme)} w-24 px-2 py-0.5 shadow-sm border-l-2 border-black/20`} 
                        onClick={() => setSelectedTheme(theme)}
                    >
                        <span className="text-sm">{theme}</span> <span className="text-sm text-gray-500">({counts[theme]})</span></button>
                </div> 
            )}
        </div>
    )
}