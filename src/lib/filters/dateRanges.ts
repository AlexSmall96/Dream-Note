export const MONTH_OPTIONS = {
    'Jan': 1,
    'Feb': 2,
    'Mar': 3,
    'Apr': 4,
    'May': 5,
    'Jun': 6,
    'Jul': 7,
    'Aug': 8,
    'Sep': 9,
    'Oct': 10,
    'Nov': 1,
    'Dec': 12
} as const

export type MonthLabel = keyof typeof MONTH_OPTIONS

export const MONTH_KEYS = Object.keys(
    MONTH_OPTIONS
) as MonthLabel[]
