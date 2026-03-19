import { useEffect, useState } from "react"

export function useIsLargeScreen() {
    const [isLarge, setIsLarge] = useState(false)

  	  	useEffect(() => {
      		const media = window.matchMedia("(min-width: 1024px)") // lg breakpoint
      		const listener = () => setIsLarge(media.matches)
      		listener()
     		media.addEventListener("change", listener)
      		return () => media.removeEventListener("change", listener)
    	}, [])

    return isLarge
}