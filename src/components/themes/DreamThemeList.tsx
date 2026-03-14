import { getColorForTheme } from "@/lib/utils/getColorForTheme"
import ThemeLabel from '@/components/themes/ThemeLabel'
import { useDreamView } from "@/contexts/DreamViewContext"
import BlankLabel from "@/components/themes/BlankLabel"

export default function DreamThemeList () {

    const { themes, peelingTheme, showBlankLabel } = useDreamView()

    return (
        <div className="absolute right-[-65px] top-16 flex flex-col gap-2">
            {themes.map((theme, index) => {
                const color = getColorForTheme(theme)
                const isPeeling = peelingTheme === theme
                return (
                    <ThemeLabel 
                        key={index} 
                        theme={theme} 
                        color={color} 
                        isPeeling={isPeeling} 
                        index={index} 
                    />
                )
            })}
            {showBlankLabel && <BlankLabel />}
        </div>
    )
}