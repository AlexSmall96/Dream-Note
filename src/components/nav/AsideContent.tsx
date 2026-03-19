"use client"
import DreamsList from '@/components/nav/DreamsList'
import MonthsWithDreams from '@/components/nav/MonthsWithDreams';
import ThemesList from '@/components/nav/ThemesList';
import { useCurrentUser } from '@/contexts/CurrentUserContext';
import { useThemesAside } from '@/contexts/ThemesAsideContext';
import ViewToggle from './ViewToggle';

export function AsideContent() {

    const { selectedTheme, view } = useThemesAside()
    const { loading, currentUser } = useCurrentUser()

    if (loading || !currentUser) return null

    return (
        <div className="p-3 w-full flex flex-col gap-2">
            <ViewToggle />
            <div className='bg-white p-2 rounded border border-gray-200 shadow-sm'>
                {view === 'themes' && <ThemesList />}
                {view === 'themes' && selectedTheme && <DreamsList />}
                {view === 'dreams' && <MonthsWithDreams />}
            </div>
        </div>
    )
}