"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/api/auth";

export default function ProtectedLayout({
  	children,
}: Readonly<{
  	children: React.ReactNode;
}>) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false)

    useEffect(() => {
        getCurrentUser().then((user) => {
            if (!user) {
                router.replace("/auth/login");
            } else {
                setAuthorized(true);
            }
        })
    }, [])

    if (!authorized) return null;
    
    return (
        <>{children}</>
    )
    }
