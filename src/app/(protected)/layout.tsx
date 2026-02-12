"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/contexts/CurrentUserContext";

export default function ProtectedLayout({
  	children,
}: Readonly<{
  	children: React.ReactNode;
}>) {
    const router = useRouter();
    const {currentUser, loading } = useCurrentUser()
    
    useEffect(() => {
      if (!loading && !currentUser) {
        router.replace("/auth/login");
      }
    }, [loading, currentUser, router])

    return (
        <>{loading? null : currentUser ? children: null}</>
    )
    }
