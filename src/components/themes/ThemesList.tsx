import { useThemesAside } from "@/contexts/ThemesAsideContext"
import { useThemes } from "@/contexts/ThemesContext"
import { getUniqueThemes } from "@/lib/utils/getUniqueThemes"

export default function ThemesList () {

    const { themes } = useThemes()
    const uniqueThemes = getUniqueThemes(themes)
    const {setSelectedTheme} = useThemesAside()

    return (
        <div>
            {uniqueThemes.map(theme =>
                <div>
                    <button className='bg-blue-200 m-1 p-2' onClick={() => setSelectedTheme(theme)}>{theme}</button>
                </div> 
            )}
        </div>
    )
}