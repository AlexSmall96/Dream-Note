"use client"

import { useState } from "react"
import { login, loginGuest } from '@/lib/api/auth'
import { useRouter } from "next/navigation"

export default function LoginForm() {
    const [formData, setFormData] = useState({email: '', password: ''})
    const [error, setError] = useState({param: '', msg: ''})
    
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const {email, password} = formData
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

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        setError({param: '', msg: ''}) // Clear error message if user inputs new data
        setFormData(prevData => ({ ...prevData, [name]: value }))
    }
    
    const router = useRouter()

    return (
        <>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-80">
                <input
                    value={formData.email}
                    onChange={handleChange}
                    name="email"
                    placeholder="Email"
                />
                {error.param === 'email' ? error.msg : ''}
                <input
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    name="password"
                    placeholder="Password"
                />
                {error.param === 'password' ? error.msg : ''}
                <button type="submit" className='bg-blue-500 hover:bg-blue-700 text-white font-bold'>Login</button>
                <button type="button" onClick={handleLoginGuest} className='bg-gray-500 hover:bg-gray-700 text-white font-bold'>Continue as Guest</button>
                <p>Don't have an account?</p>
                <button type="button" onClick={() => router.replace('/auth/signup')} className='bg-gray-500 hover:bg-gray-700 text-white font-bold'>Signup</button>
                Forgotten password?
                <button type="button" onClick={() => router.replace('/auth/reset-password')} className='bg-gray-500 hover:bg-gray-700 text-white font-bold'>Reset Password</button>
            </form>
        </>
    )
}