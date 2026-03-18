import { useThemesAside } from "@/contexts/ThemesAsideContext"
import { useThemes } from "@/contexts/ThemesContext"
import { getColorForTheme } from "@/lib/utils/getColorForTheme"
import { getUniqueThemes } from "@/lib/utils/getUniqueThemes"

export default function ThemesList () {

    const { themes, counts } = useThemes()
    const uniqueThemes = getUniqueThemes(themes)
    const {setSelectedTheme} = useThemesAside()

    return (
        <div className='max-h-64 overflow-y-auto grid grid-cols-3 gap-1'>
            {uniqueThemes.map(theme =>
                <div key={theme}>
                    <button className={`font-caveat ${getColorForTheme(theme)} px-3 py-1 shadow-md border-l-4 border-black/20`} onClick={() => setSelectedTheme(theme)}>{theme} ({counts[theme]})</button>
                </div> 
            )}
        </div>
    )
}