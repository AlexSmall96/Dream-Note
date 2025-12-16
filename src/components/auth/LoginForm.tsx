"use client"

import { useState } from "react"
import { login } from '@/lib/api/auth'
import { useRouter } from "next/navigation"

export default function LoginForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({password: '', email: ''})

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const result = await login({ email, password })
        if (result.errors){
            return console.log(result.errors)
        }   
        window.location.href = "/dreams"
  }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-80">
        <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
        />
        {errors.email?? ''}
        <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
        />
        {errors.password?? ''}
        <button type="submit">Login</button>
        </form>
    )
}