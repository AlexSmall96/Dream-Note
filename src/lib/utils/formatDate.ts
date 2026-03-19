export const formatDate = (date: string | Date, includeMonth: boolean = false, includeYear: boolean = false) => {
    const d = new Date(date)

    const day = d.getDate()
    const month = d.toLocaleString('en-GB', { month: 'short' })
    const year = d.getFullYear()

    const suffix =
        day % 10 === 1 && day !== 11 ? 'st' :
        day % 10 === 2 && day !== 12 ? 'nd' :
        day % 10 === 3 && day !== 13 ? 'rd' :
        'th';

    if (!includeMonth){
        return `${day}${suffix}`
    }

    return `${day}${suffix} ${month}${includeYear ? ` ${year}` : ''}` 
};