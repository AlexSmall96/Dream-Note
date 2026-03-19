import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

export default function LinkWithIcon({href, icon, text}:{href:string, icon:IconProp, text:string}) {
    return (
        <Link href={href} className="text-sm hover:underline">
            <FontAwesomeIcon icon={icon} className="mr-1 text-gray-500" />{text}
        </Link>
    )
}

