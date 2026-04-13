import { useDreamCounts } from "@/contexts/DreamCountsContext"

export default function AsideWrapper({children}:{children: React.ReactNode}){
    const {stats} = useDreamCounts()
    const total = stats.total
    
    if (total === 0) return null
    
    return (
        <aside className="hidden md:block w-80">
            {children}
        </aside>
    )
}