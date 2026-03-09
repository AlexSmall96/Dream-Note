import Link from "next/link";

export default function LinkWithMessage ({msg, linkText, href, disabled = false}:{
    msg: string, 
    linkText: string,
    href: string,
    disabled?: boolean
}) {

    return (
        <div className="text-center">
            <span className="text-gray-500">{msg} </span>
            <Link 
                href={href}
                className={disabled? 'text-gray-500 pointer-events-none' : "hover:underline text-blue-500"}>
                {linkText}
            </Link>
        </div>
    )
}