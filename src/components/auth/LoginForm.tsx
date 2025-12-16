"use client"

import { useState } from "react"
import { login } from '@/lib/api/auth'

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

    return (
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
        <button type="submit">Login</button>
        </form>
    )
}