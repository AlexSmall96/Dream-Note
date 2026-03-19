import { useDreams } from "@/contexts/DreamsContext"
import { useThemesAside } from "@/contexts/ThemesAsideContext"
import { formatDate } from "@/lib/utils/formatDate"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
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
        <div className="relative flex-1 max-w-lg">
            <form className="flex flex-col gap-2 border-2 rounded border-gray-300">
                <input 
                    type='text'
                    value={search}
                    onChange={handleSearch}
                    placeholder='🔍︎ Search all dreams'
                    className="px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                {searchResults.length > 0 && 
                    <div className="absolute top-full left-0 w-full bg-white border border-gray-300 z-10 rounded">
                        {searchResults.map(dream => 
                            <div 
                                key={dream._id} 
                                onClick={() => handleClick(dream._id)} 
                                className="grid grid-cols-3 hover:bg-gray-100  cursor-pointer px-2 py-0.5 justify-between items-center"
                            >
                                <span className="col-span-2 text-md">{dream.title}</span> <span className="col-span-1 text-xs text-gray-500">{formatDate(dream.date, true, true)}</span>
                            </div>
                        )}      
                    </div>
                }
            </form>
        </div>
    )
}