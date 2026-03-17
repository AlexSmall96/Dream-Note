"use client"
import DreamsList from '@/components/nav/DreamsList'
import MonthsWithDreams from '@/components/nav/MonthsWithDreams';
import ThemesList from '@/components/nav/ThemesList';
import { useCurrentUser } from '@/contexts/CurrentUserContext';
import { useDreams } from '@/contexts/DreamsContext';
import { useThemesAside } from '@/contexts/ThemesAsideContext';
import { useRouter } from "next/navigation";



export function AsideContent() {
    const router = useRouter()
    const { selectedTheme, setSelectedTheme, view, setView, search, setSearch, setChronView } = useThemesAside()
    const { searchResults } = useDreams()
    const { loading, currentUser } = useCurrentUser()

    if (loading || !currentUser) return null

    const handleChangeView = () => {
        setView(prev => prev === 'dreams' ? 'themes' : 'dreams')
        setSelectedTheme(null)
    }

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value)
    }

    const handleClick = (dreamId: string) => {
        router.replace(`/dreams/${dreamId}`)
        setChronView(false)
        setSearch('')
    }

    return (
        <div className="p-3 w-full">
            <form className="flex flex-col gap-2 border-2 border-gray-300 p-2">
                <input 
                    type='text'
                    value={search}
                    onChange={handleSearch}
                    placeholder='Search all dreams'
                />
                {searchResults.length > 0 && 
                    <div>
                        {searchResults.map(dream => 
                            <div 
                                key={dream._id} 
                                onClick={() => handleClick(dream._id)} 
                                className="hover:underline cursor-pointer"
                            >
                                {dream.title}
                            </div>
                        )}      
                    </div>
                }
            </form>

            <button 
                onClick={() => router.replace(`/dreams/create`)} 
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 w-full mt-2'
            >
                Log New Dream
            </button>

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