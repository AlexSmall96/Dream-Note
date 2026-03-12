import { useDreams } from "@/contexts/DreamsContext"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export function useDreamNavigation(id: string) {

    const { dreams } = useDreams()
    const router = useRouter()
    const [index, setIndex] = useState(0)

    useEffect(() => {
        const newIndex = dreams.findIndex(d => d._id === id)
        if (newIndex !== -1) setIndex(newIndex)
    }, [id, dreams])

    const goToNextDream = () => {
        if (index < dreams.length - 1) {
            router.push(`/dreams/${dreams[index + 1]._id}`)
        }
    }

    const goToPrevDream = () => {
        if (index > 0) {
            router.push(`/dreams/${dreams[index - 1]._id}`)
        }
    }

    return { index, maxIndex: dreams.length - 1, goToNextDream, goToPrevDream }
}