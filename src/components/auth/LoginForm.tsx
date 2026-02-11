"use client"

import { useState } from "react"
import { login, loginGuest } from '@/lib/api/auth'
import { useRouter } from "next/navigation"

export default function LoginForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState('')
    
    const [error, setError] = useState({param: '', msg: ''})
    
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const result = await login({ email, password })
        if ('errors' in result){
           return setError(result.errors[0])
        }   
        window.location.href = "/dreams"
    }

    async function handleLoginGuest() {
        try {
            await loginGuest()
            window.location.href = "/dreams"
        } catch (err){
            console.log(err)
        }
    }
    
    const router = useRouter()

    return (
        <>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-80">
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                />
                {error.param === 'email' ? error.msg : ''}
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                {error.param === 'password' ? error.msg : ''}
                <button type="submit" className='bg-blue-500 hover:bg-blue-700 text-white font-bold'>Login</button>
                <button type="button" onClick={handleLoginGuest} className='bg-gray-500 hover:bg-gray-700 text-white font-bold'>Continue as Guest</button>
                <p>Don't have an account?</p>
                <button type="button" onClick={() => router.replace('/auth/signup')} className='bg-gray-500 hover:bg-gray-700 text-white font-bold'>Signup</button>
            </form>
        </>
    )
}