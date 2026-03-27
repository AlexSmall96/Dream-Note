import { getColorForTheme } from "@/lib/utils/getColorForTheme"
import ThemeLabel from '@/components/themes/ThemeLabel'
import { useDreamView } from "@/contexts/DreamViewContext"
import BlankLabel from "@/components/themes/BlankLabel"
import { useScreenSize } from "@/app/hooks/useScreenSize"

export default function DreamThemeList () {

    const { themes, peelingTheme, showBlankLabel } = useDreamView()

    const { isLarge } = useScreenSize()

    return (
        <div className="
            absolute bottom-4 flex flex-wrap gap-2 w-1/2 pr-8
            lg:right-[-55px] lg:top-16 lg:flex-col lg:gap-2 lg:w-20"
        >
            {themes.map((theme, index) => {
                const color = getColorForTheme(theme)
                const isPeeling = peelingTheme === theme
                return (
                    <>{isLarge?
                        <ThemeLabel 
                            key={index} 
                            theme={theme} 
                            color={color} 
                            isPeeling={isPeeling} 
                            index={index} 
                        />
                    :
                        <span className='text-gray-400'>{theme}</span>
                    }</>
                )
            })}
            {showBlankLabel && isLarge && <BlankLabel />}
        </div>
    )
}