"use client"

import { useState } from "react"
import { login, loginGuest } from '@/lib/api/auth'
import LinkWithMessage from "../forms/LinkWithMessage"
import { Input } from "../forms/Input"
import Button from "../forms/Button"
import { Card } from "../ui/Card"

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
    
    return (
        <Card>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-80">
                <Input 
                    value={formData.email}
                    onChange={handleChange}
                    name="email"
                    placeholder="Email"
                />
                {error.param === 'email' ? error.msg : ''}
                <Input 
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    name="password"
                    placeholder="Password"                
                />
                {error.param === 'password' ? error.msg : ''}
                <Button text='Login' disabled={false} />
                <Button text='Continue as Guest' disabled={false} onClick={handleLoginGuest}/>
                <LinkWithMessage msg="Don't have an account?" href='/auth/signup' linkText="Signup" disabled={false} />
                <LinkWithMessage msg="Forgotten password?" href='/auth/reset-password' linkText="Reset Password" disabled={false} />
            </form>
        </Card>
    )
}