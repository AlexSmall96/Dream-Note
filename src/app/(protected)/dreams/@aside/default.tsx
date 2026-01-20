"use client"
import DreamsList from '@/components/dreams/DreamsList'
import ThemesList from '@/components/themes/ThemesList';
import { useRouter, useSearchParams } from "next/navigation";

export default function Aside() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const view = searchParams.get('view')
    return (
        <div>
            <button 
                onClick={() => router.replace("/dreams/create")} 
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold p-2'
            >
                Log New Dream
            </button>
            <button 
                onClick={() => router.replace(`/dreams?view=${view === 'themes'? 'dreams' : 'themes'}`)}
                className='bg-gray-500 hover:bg-blue-700 text-white font-bold p-2'
            >
                {view === 'themes'? 'View all dreams': 'View by theme'}
            </button>
            {view === 'themes' ? <ThemesList /> : <DreamsList />}
        </div>
  )
}
