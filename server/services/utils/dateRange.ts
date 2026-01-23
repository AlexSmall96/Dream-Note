export function getStartAndEndDates(year: number,  month: number): [Date, Date] {
    const startDate = new Date(Date.UTC(year, month - 1, 1))
    const endDate = new Date(Date.UTC(year, month, 1))
    return [startDate, endDate]
}