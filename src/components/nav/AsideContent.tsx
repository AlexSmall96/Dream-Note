"use client"
import DreamsList from '@/components/nav/DreamsList'
import MonthsWithDreams from '@/components/nav/MonthsWithDreams';
import ThemesList from '@/components/nav/ThemesList';
import { useCurrentUser } from '@/contexts/CurrentUserContext';
import { useThemesAside } from '@/contexts/ThemesAsideContext';
import ViewToggle from './ViewToggle';
import { getColorForTheme } from '@/lib/utils/getColorForTheme';

export function AsideContent() {

    const { selectedTheme, setSelectedTheme, view } = useThemesAside()
    const { loading, currentUser } = useCurrentUser()

    if (loading || !currentUser) return null

    return (
        <div className="p-3 w-full flex flex-col gap-2">
            <ViewToggle />
            {selectedTheme && view === 'themes' && 
                <div className="flex items-center gap-2">
                    <button className='mr-1' onClick={() => setSelectedTheme('')}>
                        ←
                    </button>
                    <span className={`${getColorForTheme(selectedTheme, true)} max-w-[267px] truncate text-sm w-auto px-2 py-1 shadow-sm border-l-2 border-black/20`}>{selectedTheme}</span>
                </div>
            }
            <div className='bg-white p-2 rounded border border-gray-200 shadow-sm mt-0.5'>
                {view === 'themes' && !selectedTheme && <ThemesList />}
                {view === 'themes' && selectedTheme && <DreamsList />}
                {view === 'dreams' && <MonthsWithDreams />}
            </div>
        </div>
    )
}