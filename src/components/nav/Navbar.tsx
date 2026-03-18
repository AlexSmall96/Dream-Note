"use client"

import Link from "next/link"
import { useCurrentUser } from "@/contexts/CurrentUserContext"
import Image from "next/image"
import { useState } from "react"
import SearchBar from "./SearchBar"
import AccountDropdown from "./AccountDropdown"
import OffCanvas from "./OffCanvas"
import LinkWithIcon from "../ui/LinkWithIcon"
import { 
	faFeatherPointed as faLog, 
	faChartBar as faDashboard, 
	faUserPlus as faSignup, 
	faRightToBracket as faLogin 
} from "@fortawesome/free-solid-svg-icons";

function LoggedOutNav() {
  	return (
		<>
			<LinkWithIcon href="/auth/login" icon={faLogin} text="Login" />
			<LinkWithIcon href="/auth/signup" icon={faSignup} text="Signup" />
		</>
  		)
}

function LoggedInNav() {
  	return (
		<div className="flex flex-col gap-4 md:flex-row md:items-center">
			<LinkWithIcon href='/dreams' icon={faDashboard} text='Dashboard' />
		  	<div className="flex-1">
    			<SearchBar />
  			</div>
			<LinkWithIcon href="/dreams/create" icon={faLog} text="Log Dream" />    
			<AccountDropdown />
		</div>
  	)
}


export default function Navbar() {
  	const {currentUser, loading } = useCurrentUser()
	const [isOpen, setIsOpen] = useState(false)

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
				<OffCanvas setIsOpen={setIsOpen}/>
			)}
		</nav>
  	)
}

