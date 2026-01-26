export function getStartAndEndDates(year: number,  month: number): [Date, Date] {
    const startDate = new Date(Date.UTC(year, month - 1, 1))
    const endDate = new Date(Date.UTC(year, month, 1))
    return [startDate, endDate]
}

export function getYearRange(year: number) {
    const startDate = new Date(year, 0, 1)    
    const endDate = new Date(year + 1, 0, 1)    
    return { startDate, endDate }
}