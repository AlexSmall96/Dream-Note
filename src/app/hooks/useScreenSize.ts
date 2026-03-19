import { useEffect, useState } from "react"

export function useScreenSize() {
    const [isLarge, setIsLarge] = useState(false)
	const [isMedium, setIsMedium] = useState(false)

		useEffect(() => {
			const mediaLarge = window.matchMedia("(min-width: 1024px)") // lg breakpoint
			const mediaMedium = window.matchMedia("(max-width: 768px)") // md breakpoint
			
			const listener = () => {
				setIsLarge(mediaLarge.matches)
				setIsMedium(mediaMedium.matches && !mediaLarge.matches)
			}
			listener()
			mediaLarge.addEventListener("change", listener)
			mediaMedium.addEventListener("change", listener)
			return () => {
				mediaLarge.removeEventListener("change", listener)
				mediaMedium.removeEventListener("change", listener)
			}
		}, [])

    return {isLarge, isMedium}
}