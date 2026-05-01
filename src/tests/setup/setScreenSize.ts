import {vi} from 'vitest'

export const setScreenSize = (
  size: 'extraSmall' | 'small' | 'medium' | 'large' | 'extraLarge'
) => {
  const widths = {
    extraSmall: 400,
    small: 600,
    medium: 800,
    large: 1100,
    extraLarge: 1400,
  }

  const currentWidth = widths[size]

  window.matchMedia = vi.fn().mockImplementation((query: string) => {
    const minMatch = query.match(/\(min-width:\s*(\d+)px\)/)
    const maxMatch = query.match(/\(max-width:\s*(\d+)px\)/)

    const min = minMatch ? parseInt(minMatch[1], 10) : 0
    const max = maxMatch ? parseInt(maxMatch[1], 10) : Infinity

    const matches = currentWidth >= min && currentWidth <= max

    return {
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }
  })
}