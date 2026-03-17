"use client"

import Link from "next/link"
import { useCurrentUser } from "@/contexts/CurrentUserContext"
import Image from "next/image"
import { useState } from "react"
import { AsideContent } from "@/components/nav/AsideContent"
import SearchBar from "./SearchBar"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleUser } from "@fortawesome/free-regular-svg-icons"
import IconWithTooltip from "../ui/IconWithTooltip"
import { useRouter } from "next/navigation";

function LoggedOutNav() {
  	return (
    	<>
      		<Link href="/auth/login" className="text-sm hover:underline">Login</Link>
      		<Link href="/auth/signup" className="text-sm hover:underline">Signup</Link>
    	</>
  		)
}

function LogoutButton() {
  	const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      	method: "POST",
      	credentials: "include",
    })

    	window.location.href = "/auth/login"
}

  	return <button onClick={handleLogout} className="text-sm hover:underline text-left w-full block">Logout</button>
}

function LoggedInNav() {
  	return (
		<div className="flex flex-col gap-4 md:flex-row md:items-center">
		  	<div className="flex-1">
    			<SearchBar />
  			</div>
			<Link href="/dreams/create" className="text-sm hover:underline w-full block">Log Dream</Link>
			<Link href="/dreams" className="text-sm hover:underline w-full block">View Dreams</Link>
			<Link href="/account" className="text-sm hover:underline w-full block">Account</Link>
			<LogoutButton />
		</div>
  	)
}


export default function Navbar() {
  	const {currentUser, loading } = useCurrentUser()
	const [isOpen, setIsOpen] = useState(false)
	const router = useRouter ()
  	return (
		<nav className="w-full border-b bg-purple-200">
			<div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
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
				<div className="hidden md:flex gap-4">
					{loading? null : currentUser ? <LoggedInNav /> : <LoggedOutNav />}
				</div>
				<button 
          			onClick={() => setIsOpen(prev => !prev)} 
          			className="md:hidden text-xl"
        		>
          			☰
        		</button>
			</div>
			{isOpen && (
			<div className="fixed inset-0 z-50">
				
				{/* Backdrop */}
				<div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />

				{/* Drawer */}
				<div className="absolute right-0 top-0 h-full w-[80%] max-w-sm bg-white p-4 shadow-lg overflow-y-auto">
					
					{/* Close button */}
					<button onClick={() => setIsOpen(false)} className="mb-4 text-xl">
						✕
					</button>
					<p>
						{currentUser && <span><IconWithTooltip icon={faCircleUser} tooltipText="Account" onClick={() => router.replace('/account')}/> {currentUser.email} </span> }
					</p>
					{/* <FontAwesomeIcon  className="text-2xl" /> */}
					{/* Nav items */}
					<div className="flex flex-col gap-4">
						{loading ? null : currentUser ? <LoggedInNav /> : <LoggedOutNav />}
					</div>
					<AsideContent />
				</div>
		</div>
			)}
		</nav>
  	)
}

