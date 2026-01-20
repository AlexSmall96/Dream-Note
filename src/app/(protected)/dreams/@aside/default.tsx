"use client"
import DreamsList from '@/components/dreams/DreamsList'
import ThemesList from '@/components/themes/ThemesList';
import { useThemesAside } from '@/contexts/ThemesAsideContext';
import { useRouter, useSearchParams } from "next/navigation";

export default function Aside() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const view = searchParams.get('view') === 'themes' ? 'themes' : 'dreams'
    const { selectedTheme, setSelectedTheme } = useThemesAside()

    const handleChangeView = () => {
        const newView = view === 'themes'? 'dreams' : 'themes'
        if (newView === 'dreams'){
            setSelectedTheme(null)
        }
        router.replace(`/dreams?view=${newView}`)
    }

    return (
        <div>
            <button 
                onClick={() => router.replace(`/dreams/create?view=${view}`)} 
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
            {(view === 'dreams' || selectedTheme) && <DreamsList />}
        </div>
  )
}
