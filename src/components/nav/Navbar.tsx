"use client"

import { useCurrentUser } from "@/contexts/CurrentUserContext"
import { useEffect, useState } from "react"
import SearchBar from "./SearchBar"
import AccountDropdown from "./AccountDropdown"
import OffCanvas from "./OffCanvas"
import Logo from "./Logo"
import LinkWithIcon from "../ui/LinkWithIcon"
import { faFeatherPointed as faLog, faChartBar as faDashboard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useScreenSize } from "@/app/hooks/useScreenSize"
import { useThemesAside } from "@/contexts/ThemesAsideContext"
import { useDreamCounts } from "@/contexts/DreamCountsContext"

export default function Navbar() {
  	const {currentUser, loading } = useCurrentUser()
	const { setIsOpen } = useThemesAside()
	const [hovered, setHovered] = useState(false)
	const {uniqueYears} = useDreamCounts().stats

	const { isLargeAndAbove, isMedium } = useScreenSize()

	if (loading || !currentUser) return null

    useEffect(() => {
        if (!isMedium) {
            setIsOpen(false)
        }
    }, [isMedium])
	
  	return (
		<nav className="border-b bg-purple-200">
			<div className="mx-auto flex items-center justify-between px-4 py-3">

				<Logo />
				
				<div className="hidden md:flex flex-1 gap-4 md:items-center justify-end">

					<LinkWithIcon href='/dreams' icon={faDashboard} text='Dashboard' />
					{uniqueYears.length > 0 && <SearchBar />}
					<button 
						onClick={() => window.location.href = '/dreams/create'} 
						onMouseEnter={() => setHovered(true)}
						onMouseLeave={() => setHovered(false)}
						className="bg-purple-500 text-white px-3 py-1.5 rounded hover:bg-purple-600 transition-colors text-sm"
					>
						<FontAwesomeIcon icon={faLog} className="mr-1" />
						<span className="hidden lg:inline">Log Dream</span>
							{hovered && !isLargeAndAbove && (
							<div className="absolute right-2 top-16 transform -translate-x-1/2 -translate-y-1/2 mr-2 px-2 py-1 bg-yellow-200 text-gray-800 text-xs whitespace-nowrap">
								Log Dream
							</div>
						)}
					</button>
					<AccountDropdown />
					
				</div>
				<button onClick={() => setIsOpen(true)} className="md:hidden text-xl">
          			☰
        		</button>
			</div>
			<OffCanvas />
		</nav>
  	)
}