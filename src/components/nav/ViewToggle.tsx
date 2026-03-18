import { useThemesAside } from '@/contexts/ThemesAsideContext'
import { Tab, TabGroup, TabList } from '@headlessui/react'

export default function ViewToggle() {
    
    const { setSelectedTheme, setView } = useThemesAside()

    const handleChangeView = (view: 'dreams' | 'themes') => {
        setView(view)
        setSelectedTheme(null)
    }

    return (
        <TabGroup>
            <TabList className="flex gap-1 bg-gray-100 p-1 rounded-full">
                <Tab 
                    onClick={() => handleChangeView('dreams')}
                    className="px-3 py-1 text-sm rounded-full data-[hover]:underline data-[selected]:bg-blue-500 data-[selected]:text-white">
                View By Date
                </Tab>
                <Tab 
                    onClick={() => handleChangeView('themes')}
                    className="px-3 py-1 text-sm rounded-full data-[hover]:underline data-[selected]:bg-blue-500 data-[selected]:text-white">
                View By Theme
                </Tab>
            </TabList>
        </TabGroup>
    )
}


