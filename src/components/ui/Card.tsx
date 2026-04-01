import { PropsWithChildren } from "react"

type CardProps = PropsWithChildren<{
    className?: string
}>

export function Card({ children, className = "" }: CardProps) {
    return (
        <div className={`bg-white p-5 shadow-md rounded-md ${className}`}>
            {children}
        </div>
    ) 
}