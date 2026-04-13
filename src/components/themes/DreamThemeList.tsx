import { getColorForTheme } from "@/lib/utils/getColorForTheme"
import ThemeLabel from '@/components/themes/ThemeLabel'
import { useDreamView } from "@/contexts/DreamViewContext"
import BlankLabel from "@/components/themes/BlankLabel"
import { useScreenSize } from "@/app/hooks/useScreenSize"

export default function DreamThemeList () {

    const { themes, peelingTheme, showBlankLabel } = useDreamView()

    const { isLargeAndAbove, isExtraSmall } = useScreenSize()

    return (
        <div className={
            `absolute bottom-4 flex flex-wrap gap-2 md:w-3/5 lg:w-1/2 pr-8 ${isExtraSmall ? 'w-full' : 'w-3/5'}
            xl:right-[-65px] xl:top-16 xl:flex-col xl:w-20 xl:min-w-0`
        }
        >
            {themes.map((theme, index) => {
                const color = getColorForTheme(theme)
                const isPeeling = peelingTheme === theme
                return (
                    <div key={theme}>
                    {isLargeAndAbove?
                        <ThemeLabel 
                            theme={theme} 
                            color={color} 
                            isPeeling={isPeeling} 
                            index={index} 
                        />
                    :
                        <span className='pr-1 text-gray-400 max-w-[80px] truncate block'>{theme}</span>
                    }
                    </div>
                )
            })}
            {showBlankLabel && isLargeAndAbove && <BlankLabel />}
        </div>
    )
}