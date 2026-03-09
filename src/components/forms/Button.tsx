import { MouseEventHandler } from "react"

export default function Button({
    text,
    disabled,
    type = 'submit',
    onClick = () => {}
}:{
    text: string,
    disabled: boolean
    type?: 'submit' | 'button'
    onClick?: MouseEventHandler<HTMLButtonElement>
}) {
    const colorClass = disabled? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-700'

    return (
        <button 
            type={type}
            className={`rounded-lg ${colorClass} text-white font-bold p-2`} disabled={disabled}
            onClick={onClick}
        >
                {text}
        </button>
    )
}