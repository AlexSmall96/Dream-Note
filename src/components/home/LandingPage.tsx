"use client"
import { fetchCurrentUser, loginGuest } from "@/lib/api/auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function LandingPage(){

    const router = useRouter()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const redirect = async () => {
            const result = await fetchCurrentUser()  
            if (!('errors' in result)){
                router.replace('/dreams')
            } else {
                setLoading(false)
            }
        }
        redirect()
    }, [])

    if (loading) return (<div>...Loading</div>)
        
    async function handleLoginGuest() {
        try {
            await loginGuest()
            window.location.href = "/dreams"
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
