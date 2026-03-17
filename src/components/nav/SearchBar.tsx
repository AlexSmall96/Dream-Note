import { useDreams } from "@/contexts/DreamsContext"
import { useThemesAside } from "@/contexts/ThemesAsideContext"
import { useRouter } from "next/navigation"

export default function SearchBar() {
    
    const { searchResults } = useDreams()
    const { search, setSearch, setChronView } = useThemesAside()
    
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value)
    }

    const router = useRouter()

    const handleClick = (dreamId: string) => {
        router.replace(`/dreams/${dreamId}`)
        setChronView(false)
        setSearch('')
    }

    return (
        <div className="relative flex-1">
            <form className="flex flex-col gap-2 border-2 border-gray-300 p-2">
                <input 
                    type='text'
                    value={search}
                    onChange={handleSearch}
                    placeholder='Search all dreams'
                />
                {searchResults.length > 0 && 
                    <div className="absolute top-full left-0 w-full bg-white border border-gray-300 z-10">
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
        </div>
    )
}