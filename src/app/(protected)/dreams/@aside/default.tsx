"use client"
import DreamsList from '@/components/dreams/DreamsList'
import MonthsWithDreams from '@/components/dreams/MonthsWithDreams';
import ThemesList from '@/components/themes/ThemesList';
import { useCurrentUser } from '@/contexts/CurrentUserContext';
import { useDreams } from '@/contexts/DreamsContext';
import { useThemesAside } from '@/contexts/ThemesAsideContext';
import { useRouter } from "next/navigation";

export default function Aside() {
    const router = useRouter()
    const { selectedTheme, setSelectedTheme, view, setView, search, setSearch, setChronView } = useThemesAside()
    const { searchResults } = useDreams()

    const handleChangeView = () => {
        setView(prev => prev === 'dreams'? 'themes': 'dreams')
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

    const { loading, currentUser } = useCurrentUser()

    return (
        loading || !currentUser? 
            null 
        :
            <div>
                <form className="flex flex-col gap-2 w-80 m-3 border-2 border-gray-300">
                    <input 
                        type='text'
                        value={search}
                        onChange={handleSearch}
                        placeholder='Search all dreams'
                    />
                    {searchResults.length > 0 && 
                    <div>
                        {searchResults.map(dream => 
                            <div key={dream._id} onClick={() => handleClick(dream._id)} className="col-span-2 hover:underline">{dream.title}</div>
                        )}      
                    </div>}
                </form>

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
                    {view === 'themes'? 'View by date': 'View by theme'}
                </button>
                {view === 'themes' && <ThemesList />}
                {selectedTheme && <DreamsList />}
                {view === 'dreams' && <MonthsWithDreams />}
            </div>
  )
}
