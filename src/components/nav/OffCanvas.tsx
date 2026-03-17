import { setterFunction } from "@/types/setterFunctions";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/contexts/CurrentUserContext";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons";
import IconWithTooltip from "../ui/IconWithTooltip";
import AccountDropdown from "./AccountDropdown";
import { AsideContent } from "./AsideContent";
import SearchBar from "./SearchBar";

export default function OffCanvas({ setIsOpen }: { setIsOpen: setterFunction<boolean> }) {

    const handleLogout = async () => {
        await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
        })
    	window.location.href = "/auth/login"
    }


    const { currentUser, loading } = useCurrentUser()
    const router = useRouter()
    return (
    			<div className="fixed inset-0 z-50">
				
				<div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />

				<div className="absolute right-0 top-0 h-full w-[80%] max-w-sm bg-white p-4 shadow-lg overflow-y-auto">
					
					<button onClick={() => setIsOpen(false)} className="mb-4 text-xl">
						✕
					</button>
					<div className="flex flex-col gap-4">
						{loading ? null : currentUser ? 
                            <>
                                <h1 className="text-sm"><FontAwesomeIcon icon={faCircleUser} className='text-gray-500 text-3xl' />{currentUser?.email}</h1>
                                {currentUser?.isVerified && <p className="text-xs">Verified <span className='text-green-500'>✓</span></p>} 
                                <Link href="/account" className='text-left block w-full text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'>
                                    Account
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className='text-left block w-full text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                >
                                    Logout
                                </button>
                                <SearchBar />
                                <AsideContent />
                            </>
                        : 
                            <>
                                <Link href="/auth/login" className="text-sm hover:underline">Login</Link>
                                <Link href="/auth/signup" className="text-sm hover:underline">Signup</Link>
    	                    </>}
					</div>
					
				</div>
			</div>
)
}

