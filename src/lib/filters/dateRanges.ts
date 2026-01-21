export const DATE_RANGE_OPTIONS = {
    'Last 7 days': 7,
    'Last month': 31,
    'Last 2 months': 61,
    'Last 6 months': 183,
    'Last year': 365,
    'All time': 22000,
} as const

export type DateRangeLabel = keyof typeof DATE_RANGE_OPTIONS

export const DATE_RANGE_KEYS = Object.keys(
    DATE_RANGE_OPTIONS
) as DateRangeLabel[]
