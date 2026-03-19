"use client"

import { useCurrentUser } from "@/contexts/CurrentUserContext"
import { useState } from "react"
import SearchBar from "./SearchBar"
import AccountDropdown from "./AccountDropdown"
import OffCanvas from "./OffCanvas"
import Logo from "./Logo"
import LinkWithIcon from "../ui/LinkWithIcon"
import { faFeatherPointed as faLog, faChartBar as faDashboard } from "@fortawesome/free-solid-svg-icons";

function LoggedInNav() {
  	return (
		<div className="hidden md:flex flex-1 gap-4 md:items-center justify-end">
			<LinkWithIcon href='/dreams' icon={faDashboard} text='Dashboard' />
			<SearchBar />
			<LinkWithIcon href="/dreams/create" icon={faLog} text="Log Dream" />    
			<AccountDropdown />
		</div>
  	)
}


export default function Navbar() {
  	const {currentUser, loading } = useCurrentUser()
	const [isOpen, setIsOpen] = useState(false)

  	return (
		<nav className="border-b bg-purple-200">
			<div className="mx-auto flex items-center justify-between px-4 py-3">
				<Logo />
					{loading || !currentUser ? null : <LoggedInNav />}
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

