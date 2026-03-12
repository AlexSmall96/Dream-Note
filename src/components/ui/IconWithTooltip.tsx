import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import Link from "next/link";

export default function IconWithTooltip({
    icon, 
    tooltipText,
    href, 
    extraClass = '',
    danger = false
}:{
    icon: IconProp,
    tooltipText: string
    href: string,
    extraClass?: string,
    danger?: boolean
}){
    return (
        <Link href={href}>
                <div className="relative group inline-block">
                    <FontAwesomeIcon icon={icon} className={`cursor-pointer ${extraClass} ${danger ? 'text-orange-500': ''}`} />
                        <span 
                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                                opacity-0 group-hover:opacity-100 transition
                                bg-yellow-200 text-gray-800 text-xs px-2 py-1 shadow rotate-1 whitespace-nowrap"
                        >
                            {tooltipText}  
                        </span>
                </div>
        </Link> 
    )
}