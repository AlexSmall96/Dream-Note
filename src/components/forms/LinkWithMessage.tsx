import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function LinkWithMessage ({msg, linkText, icon, href, disabled = false, danger = false}:{
    msg?: string, 
    linkText: string,
    icon?: IconProp,
    href: string,
    disabled?: boolean,
    danger? : boolean
}) {

    return (
        <div className="text-center">
            <span className="text-gray-500">{msg} </span>
            <Link 
                href={href}
                className={disabled? 'text-gray-500 pointer-events-none' : `hover:underline ${danger? 'text-orange-500' :'text-blue-500'}`}>
                    {icon && <FontAwesomeIcon icon={icon} />}
                    <span >{linkText}</span>
            </Link>
        </div>
    )
}