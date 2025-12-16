"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getCurrentUser } from "@/lib/api/auth"

type User = {
  id: string
  email: string
}

function LoggedOutNav() {
  return (
    <>
      <Link href="/auth/login">Login</Link>
      <Link href="/auth/signup">Signup</Link>
    </>
  )
}

function LogoutButton() {
  	const handleLogout = async () => {
    await fetch("/api/users/logout", {
      	method: "POST",
      	credentials: "include",
    })

    window.location.href = "/auth/login"
  }

  return <button onClick={handleLogout}>Logout</button>
}

function LoggedInNav() {
  return (
    <>
        <Link href="/dreams">Dreams</Link>
        <Link href="/profile">Profile</Link>
        <LogoutButton />
    </>
  )
}


export default function Navbar() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getCurrentUser()
        .then(setUser)
        .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return null
    }

  return (
    <nav>
      {user ? <LoggedInNav /> : <LoggedOutNav />}
    </nav>
  )
}

