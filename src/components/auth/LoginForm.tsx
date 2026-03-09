"use client"

import { useEffect, useState } from "react"
import { login, loginGuest } from '@/lib/api/auth'
import LinkWithMessage from "../forms/LinkWithMessage"
import { Input } from "../forms/Input"
import Button from "../forms/Button"
import { Card } from "../ui/Card"

export default function LoginForm() {
    const [formData, setFormData] = useState({email: '', password: ''})
    const [error, setError] = useState<string | null>(null)
    const [disabled, setDisabled] = useState(false)
    const [waiting, setWaiting] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setWaiting(true)
        const {email, password} = formData
        const result = await login({ email, password })
        if ('errors' in result){
           setWaiting(false)
           return setError(result.errors[0].msg)
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

    useEffect(() => {
        const {email, password} = formData
        const emptyInput = email === '' || password === ''
        if (waiting || emptyInput || error){
            setDisabled(true)
        } else {
            setDisabled(false)
        }
    }, [waiting, error, formData])

    
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        setError(null) // Clear error message if user inputs new data
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
                    aria-label='email'
                    disabled={waiting}
                />
                <Input 
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    name="password"
                    placeholder="Password"   
                    aria-label='password'  
                    disabled={waiting}           
                />
                {error  && <p role='alert'>{error}</p>}
                <Button text={waiting? 'Logging in...' : 'Login'} disabled={disabled} />
                <Button text='Continue as Guest' disabled={waiting} onClick={handleLoginGuest}/>
                <LinkWithMessage msg="Don't have an account?" href='/auth/signup' linkText="Sign up" disabled={waiting} />
                <LinkWithMessage msg="Forgotten password?" href='/auth/reset-password' linkText="Reset Password" disabled={waiting} />
            </form>
        </Card>
    )
}