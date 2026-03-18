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
            className='text-left block w-full text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        >
            Logout
        </button>
    )
}