import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import Link from "next/link";
import { useScreenSize } from "@/app/hooks/useScreenSize";

export default function IconWithTooltip({
    icon, 
    tooltipText,
    href, 
    extraClass = '',
    danger = false,
    onClick = () => {},
    disabled = false
}:{
    icon: IconProp,
    tooltipText: string
    href?: string,
    extraClass?: string,
    danger?: boolean,
    onClick?: () => void,
    disabled?: boolean
}){

    const {isMedium} = useScreenSize()

    const Icon = 
        <div className="font-sans relative group inline-block">
            <FontAwesomeIcon 
                icon={icon} 
                className={`${extraClass} ${danger ? 'text-orange-500': disabled? 'text-gray-400': 'cursor-pointer'} hover:animate-pulse`} 
                onClick={disabled ? () => {} : onClick}
            />
            {!disabled && !isMedium && <span 
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                    opacity-0 group-hover:opacity-100 transition
                    bg-yellow-200 text-gray-800 text-xs px-2 py-1 shadow rotate-1 whitespace-nowrap select-none cursor-default"
            >
                {tooltipText}  
            </span>}
        </div>

    return (
        href ? <Link href={href}>{Icon}</Link> : Icon
    )
}