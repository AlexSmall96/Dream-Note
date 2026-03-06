"use client";
import { useState } from "react";
import { signup } from "@/lib/api/auth";
import Link from "next/link";
import { parseErrors } from "@/lib/utils/parseErrors";
import SubmitButton from '@/components/ui/SubmitButton';

export default function SignupForm() {

    const [formData, setFormData] = useState({email: '', password1: '', password2: ''});
    const [errors, setErrors] = useState({password: '', email: '', general: ''});
    const defautltMsg = 'Already have an account?'
    const [msg, setMsg] = useState(defautltMsg)
    const [waiting, setWaiting] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (waiting) return
        const {name, value} = e.target
        setFormData({...formData, [name]: value})
        setErrors({password: '', email: '', general: ''}) // Clear error messages
        setMsg(defautltMsg) // Set message to default
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const {email, password1, password2} = formData
        if (password1 !== password2){
            return setErrors({...errors, password: 'Password and confirm password must match.'})
        } 
        try {
            setWaiting(true)
            const result = await signup({ email, password: password1 });
            if ('errors' in result){
                const emailError = parseErrors(result.errors, 'email')
                const pwdError = parseErrors(result.errors, 'password')
                setErrors({...errors, email: emailError, password: pwdError})
            } else {
                setMsg(result.message)
            }
            setWaiting(false)
        } catch (err){
            setErrors({general: 'Currently unable to signup due to system issues.', email: '', password: ''})
        }
    }

  return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-80">
            <input
                value={formData.email}
                onChange={handleChange}
                name="email"
                placeholder="Email"
                disabled={waiting}
                className='rounded-sm'
            />
            {errors.email?? ''}
            <input
                type="password"
                value={formData.password1}
                onChange={handleChange}
                name="password1"
                placeholder="Password"
                disabled={waiting}
                className='rounded-sm'
            />
            <input
                type="password"
                value={formData.password2}
                onChange={handleChange}
                name="password2"
                placeholder="Confirm Password"
                disabled={waiting}
                className='rounded-sm'
            />
            {errors.password?? ''}
            <SubmitButton disabled={waiting} text={waiting? 'Signing up...' : 'Sign up'}/>
            {/* Dont render p for system error unless its non empty */}
            {errors.general && <p>{errors.general}</p>} 
            <div className="text-center">
                <span className="text-gray-500">{msg} </span>
                <Link 
                    href={`/auth/${waiting? 'signup' : 'login'}`}
                    className={waiting? 'text-gray-500 pointer-events-none' :"hover:underline text-blue-500"}>
                    Login
                </Link>
            </div>
        </form>
    )
}