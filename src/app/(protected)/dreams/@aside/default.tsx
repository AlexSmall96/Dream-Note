"use client"
import DreamsList from '@/components/dreams/DreamsList'
import MonthsWithDreams from '@/components/dreams/MonthsWithDreams';
import ThemesList from '@/components/themes/ThemesList';
import { useThemesAside } from '@/contexts/ThemesAsideContext';
import { useRouter } from "next/navigation";

export default function Aside() {
    const router = useRouter()
    const { selectedTheme, setSelectedTheme, view, setView } = useThemesAside()

    const handleChangeView = () => {
        setView(prev => prev === 'dreams'? 'themes': 'dreams')
        setSelectedTheme(null)
    }

    return (
        <div>
            <button 
                onClick={() => router.replace(`/dreams/create`)} 
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold p-2'
            >
                Log New Dream
            </button>
            <button 
                onClick={handleChangeView}
                className='bg-gray-500 hover:bg-blue-700 text-white font-bold p-2'
            >
                {view === 'themes'? 'View all dreams': 'View by theme'}
            </button>
            {view === 'themes' && <ThemesList />}
            {selectedTheme && <DreamsList />}
            {view === 'dreams' && <MonthsWithDreams />}
        </div>
  )
}
