export function getFromDate(daysAgo?: number): Date {
    if (!daysAgo) return new Date("1970-01-01")
    return new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
}