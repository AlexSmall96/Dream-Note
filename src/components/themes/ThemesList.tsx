import { useThemes } from "@/contexts/ThemesContext"

export default function ThemesList () {

    const { themes } = useThemes()
    return (
        <div>
            {themes.map(theme => 
                <p key={theme._id}>{theme.theme}, {theme.dream.title}</p>
            )}
        </div>
    )
}