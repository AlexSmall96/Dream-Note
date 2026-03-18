import { useCurrentUser } from '@/contexts/CurrentUserContext'
import { faCircleUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import Link from "next/link"

export default function AccountDropdown() {
    
    const handleLogout = async () => {
        await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
        })
    	window.location.href = "/auth/login"
    }

    const { currentUser } = useCurrentUser()
    return (
        <Menu as="div" className="relative inline-block rounded-sm text-left">
            <MenuButton className="inline-flex w-full justify-center gap-x-1.5">
                <FontAwesomeIcon icon={faCircleUser} className='text-gray-500 text-3xl' />
            </MenuButton>
            <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg outline-1 outline-black/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
            >
            <div className='bg-gray-200 rounded-sm'>
                <h1 className="text-sm px-4 py-2">{currentUser?.email}</h1>
                {currentUser?.isVerified && <p className="text-xs px-4 pb-2">Verified <span className='text-green-500'>✓</span></p>}
            </div>
                <div>
                    <MenuItem>
                        <Link href="/account" className='text-left block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'>
                            Account
                        </Link>
                    </MenuItem>
                    <MenuItem>
                        <button
                            onClick={handleLogout}
                            className='text-left block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        >
                            Logout
                        </button>
                    </MenuItem>
                </div>
            </MenuItems>
        </Menu>
    )
}
