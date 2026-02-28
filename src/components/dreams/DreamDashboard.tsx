export default function DreamDashboard ({total, totalPastMonth}:{total: number, totalPastMonth: number}) {
    return (
        <>  <h1>Totals:</h1>
            <h1>Last 4 weeks: {totalPastMonth}</h1> /
            <h1>All time: {total}</h1>    
        </>
    )
}