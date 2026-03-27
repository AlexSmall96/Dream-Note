import { useEffect, useState } from "react"

export function useScreenSize() {
    const [isLarge, setIsLarge] = useState(false)
	const [isMedium, setIsMedium] = useState(false)
	const [isExtraLarge, setIsExtraLarge] = useState(false)
	const [isLargeAndAbove, setIsLargeAndAbove] = useState(false)
	
		useEffect(() => {
			const mediaExtraLarge = window.matchMedia("(min-width: 1280px)") // xl breakpoint
			const mediaLarge = window.matchMedia("(min-width: 1024px)") // lg breakpoint
			const mediaMedium = window.matchMedia("(max-width: 768px)") // md breakpoint
			
			const listener = () => {
				setIsExtraLarge(mediaExtraLarge.matches)
				setIsLarge(mediaLarge.matches && !mediaExtraLarge.matches)
				setIsMedium(mediaMedium.matches && !mediaLarge.matches)
				setIsLargeAndAbove(mediaLarge.matches)
			}
			listener()
			mediaExtraLarge.addEventListener("change", listener)
			mediaLarge.addEventListener("change", listener)
			mediaMedium.addEventListener("change", listener)
			return () => {
				mediaExtraLarge.removeEventListener("change", listener)
				mediaLarge.removeEventListener("change", listener)
				mediaMedium.removeEventListener("change", listener)
			}
		}, [])
	
    return { isExtraLarge, isLarge, isMedium, isLargeAndAbove }
}