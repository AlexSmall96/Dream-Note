import { useThemesAside } from '@/contexts/ThemesAsideContext'
import { Tab, TabGroup, TabList } from '@headlessui/react'
import { faBookOpen as faBrowse} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function ViewToggle() {
    
    const { setView } = useThemesAside()

    return (
        <TabGroup className='flex flex-col gap-2 w-full'>
            <div className="flex items-center gap-2 w-full">
                <span className='text-sm pr-2'>
                    <FontAwesomeIcon icon={faBrowse} className="text-gray-500" /> Browse:
                </span>
                <TabList className="flex gap-0 bg-gray-100 p-1 rounded-lg text-sm flex-1">
                    <Tab 
                        onClick={() => setView('dreams')}
                        className="flex-1 px-3 py-1 text-sm rounded-full data-[hover]:underline data-[selected]:bg-purple-400 data-[selected]:text-white flex items-center justify-center"
                    >
                        By Date
                    </Tab>
                    <Tab 
                        onClick={() => setView('themes')}
                        className="flex-1 px-3 py-1 text-sm rounded-full data-[hover]:underline data-[selected]:bg-purple-400 data-[selected]:text-white flex items-center justify-center"
                    >
                        By Theme
                    </Tab>
                </TabList>
            </div>
        </TabGroup>
    )
}


