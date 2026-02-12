"use client"
import { ReactNode } from "react"
import { CurrentUserProvider } from "@/contexts/CurrentUserContext"

export default function RootClientWrapper({ children }: { children: ReactNode }) {
    return (
        <CurrentUserProvider>
            {children}
        </CurrentUserProvider>
    ) 
}
