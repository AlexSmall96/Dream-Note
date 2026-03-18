import Link from "next/link"
import Image from "next/image"


export default function Logo () {
    return (
        <Link href="/" className="font-playwrite flex items-center text-lg font-semibold">
            DreamN
            <Image
                alt="sleepy emoji"
                width={25}
                height={25}
                src="/images/sleepy.png"
            />
            te
        </Link>
    )
}