export default function ({
    text,
    disabled
}:{
    text: string,
    disabled: boolean
}) {
    const colorClass = disabled? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-700'

    return (
        <button 
            type='submit' 
            className={`rounded-lg ${colorClass} text-white font-bold p-2`} disabled={disabled}
        >
                {text}
        </button>
    )
}