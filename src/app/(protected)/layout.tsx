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
      const checkAuth = async () => {
        try {
          const result = await getCurrentUser()
          if (!('errors' in result)){
            setAuthorized(true)
          } else {
            router.replace("/auth/login");
          }
        } catch(err){
          console.log(err)
        }
      }
      checkAuth()
    }, [])

    if (!authorized) return null;
    
    return (
        <>{children}</>
    )
    }
