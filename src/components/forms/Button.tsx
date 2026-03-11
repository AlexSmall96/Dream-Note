import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { MouseEventHandler } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function Button({
    text,
    disabled,
    type = 'submit',
    onClick = () => {},
    danger = false,
    icon
}:{
    text: string,
    disabled: boolean
    type?: 'submit' | 'button'
    onClick?: MouseEventHandler<HTMLButtonElement>
    danger?: boolean,
    icon?: IconProp
}) {
    const colorClass = disabled? 'bg-gray-400' : danger ? 'bg-orange-500 hover:bg-orange-700' : 'bg-blue-500 hover:bg-blue-700'

    return (
        <button 
            type={type}
            className={`rounded-lg ${colorClass} text-white font-bold p-2`} disabled={disabled}
            onClick={onClick}
        >
                {icon && <FontAwesomeIcon icon={icon} />} { text}
        </button>
    )
}