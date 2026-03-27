import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { MouseEventHandler } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function Button({
    text,
    disabled = false,
    type = 'submit',
    onClick = () => {},
    danger = false,
    icon,
    color,
}:{
    text?: string,
    disabled?: boolean
    type?: 'submit' | 'button'
    onClick?: MouseEventHandler<HTMLButtonElement>
    danger?: boolean,
    icon?: IconProp,
    color?: string,
}) {
    const className = disabled? 'bg-gray-300' : danger ? 'bg-orange-500 hover:bg-orange-700' : color ?? 'bg-purple-400 hover:bg-purple-700'
    return (
        <button 
            type={type}
            className={`rounded-lg ${className} text-white font-bold p-2`} disabled={disabled}
            onClick={onClick}
        >
                {icon && <FontAwesomeIcon icon={icon} />} { text}
        </button>
    )
}