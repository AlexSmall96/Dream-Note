import { useState } from "react"
import { useDreamView } from "@/contexts/DreamViewContext"
import { getColorForTheme } from "@/lib/utils/getColorForTheme"

export default function BlankLabel ({

}) {
    const [newTheme, setNewTheme] = useState({text: '', color: ''})
    const { themes, setShowBlankLabel, addTheme } = useDreamView()

    const defaultColor = 'bg-gray-300'

    const handleChangeBlankLabel = (event: React.ChangeEvent<HTMLInputElement>) => {
        const text = event.target.value.trim()
        const color = text.length < 3 ? defaultColor : getColorForTheme(text)
        setNewTheme({color, text})
    }

    const handleAddTheme = () => {
        addTheme(newTheme.text)
        setNewTheme({text: '', color: ''})
    }

    const handleCloseBlankLabel = () => {
        setShowBlankLabel(false)
        setNewTheme({text: '', color: ''})
    }

    return (
        <span
            className={`group flex items-center gap-1 ${newTheme.color || defaultColor} text-xs px-1 py-1 shadow-md border-l-4 border-black/20
                    transition-all duration-200`}
                style={{ transform: `translateY(${themes.length * 2}px)` }}
                >
                    <form>
                        <input
                            type='text'
                            className={`${newTheme.color || defaultColor} focus:outline-none w-10`}
                            value={newTheme.text}
                            onChange={handleChangeBlankLabel}
                        />
                    </form>
                <button 
                    className="text-xs text-gray-700 rounded-full w-2 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition"
                    onClick={handleCloseBlankLabel}
                >    
                    x
                </button>
                <button 
                    className="text-xs text-gray-700 rounded-full w-2 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition"
                    onClick={handleAddTheme}
                >    
                    ✓
                </button>
                </span>
    )
}

