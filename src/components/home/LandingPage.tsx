"use client"
import { useCurrentUser } from "@/contexts/CurrentUserContext"
import { loginGuest } from "@/lib/api/auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LandingPage(){

    const router = useRouter()
    const {currentUser, loading } = useCurrentUser()

    // Redirect to dreams dashboard if logged in
    useEffect(() => {
        if (!loading && currentUser) {
            router.replace("/dreams");
        }
    }, [loading, currentUser, router])

    if (loading) return (<div>...Loading</div>)
    
    
    async function handleLoginGuest() {
        try {
            await loginGuest()
            router.replace("/dreams")
        } catch (err){
            console.log(err)
        }
    }

    return (
        <>
            <a href='/auth/login' className="font-medium text-fg-brand hover:underline text-blue-500">Login</a>
            <a href='/auth/signup' className="font-medium text-fg-brand hover:underline text-blue-500">Signup</a>
            or
            <button type="button" onClick={handleLoginGuest} className='bg-gray-500 hover:bg-gray-700 text-white font-bold p-1'>Continue as Guest</button>
        </>
    )
}
