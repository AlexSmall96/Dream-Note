"use client"
import DreamsList from '@/components/nav/DreamsList'
import MonthsWithDreams from '@/components/nav/MonthsWithDreams';
import ThemesList from '@/components/nav/ThemesList';
import { useCurrentUser } from '@/contexts/CurrentUserContext';
import { useDreams } from '@/contexts/DreamsContext';
import { useThemesAside } from '@/contexts/ThemesAsideContext';



export function AsideContent() {
    const { selectedTheme, setSelectedTheme, view, setView } = useThemesAside()
    const { loading, currentUser } = useCurrentUser()

    if (loading || !currentUser) return null

    const handleChangeView = () => {
        setView(prev => prev === 'dreams' ? 'themes' : 'dreams')
        setSelectedTheme(null)
    }


    return (
        <div className="p-3 w-full">
            <button 
                onClick={handleChangeView}
                className='bg-gray-500 hover:bg-blue-700 text-white font-bold p-2 w-full mt-2'
            >
                {view === 'themes'? 'View by date': 'View by theme'}
            </button>

            {view === 'themes' && <ThemesList />}
            {selectedTheme && <DreamsList />}
            {view === 'dreams' && <MonthsWithDreams />}
        </div>
    )
}