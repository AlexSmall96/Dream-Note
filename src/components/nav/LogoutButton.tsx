import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRightFromBracket as faLogout } from "@fortawesome/free-solid-svg-icons"

export default function LogoutButton() {
        const handleLogout = async () => {
        await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
        })
    	window.location.href = "/auth/login"
    }

    return (
        <button
            onClick={handleLogout}
            className='text-left block w-full text-sm text-gray-700 hover:bg-gray-100 hover:underline hover:text-gray-900 pl-1'
        >
            <FontAwesomeIcon icon={faLogout} className="mr-1 text-gray-500" />Logout
        </button>
    )
}