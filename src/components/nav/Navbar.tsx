"use client"

import Link from "next/link"
import { useCurrentUser } from "@/contexts/CurrentUserContext"

function LoggedOutNav() {
  return (
    <>
      <Link href="/auth/login" className="text-sm hover:underline">Login</Link>
      <Link href="/auth/signup" className="text-sm hover:underline">Signup</Link>
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

  return <button onClick={handleLogout} className="text-sm hover:underline">Logout</button>
}

function LoggedInNav() {
  return (
    <>
        <Link href="/dreams" className="text-sm hover:underline">Dreams</Link>
        <Link href="/profile" className="text-sm hover:underline">Profile</Link>
        <LogoutButton />
    </>
  )
}


export default function Navbar() {
    const {currentUser, loading } = useCurrentUser()


  return (
    <nav className="w-full border-b bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold">
          DreamNote
        </Link>
        <div className="flex gap-4">
          {loading? null : currentUser ? <LoggedInNav /> : <LoggedOutNav />}
        </div>
      </div>
    </nav>
  )
}

