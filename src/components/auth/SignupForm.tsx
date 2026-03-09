"use client";
import { useEffect, useState } from "react";
import { signup } from "@/lib/api/auth";
import Link from "next/link";
import { parseErrors } from "@/lib/utils/parseErrors";
import SubmitButton from '@/components/ui/SubmitButton';
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";

export default function SignupForm() {

    type ErrorType = {
        email: string | null,
        password1: string | null,
        general: string | null
    }

    const [formData, setFormData] = useState({email: '', password1: '', password2: ''});
    const [errors, setErrors] = useState<ErrorType>({password1: null, email: null, general: null});
    const defautltMsg = 'Already have an account?'
    const [msg, setMsg] = useState(defautltMsg)
    const [disabled, setDisabled] = useState(false)
    const [waiting, setWaiting] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (waiting) return
        const {name, value} = e.target
        if (name === 'email'){
            // Re-enables button after success only if email is changed
            setSuccess(false)
        }
        setFormData({...formData, [name]: value})
        // Clear error for changed input
        if (name === 'password2'){
            // Remove password error if either password input is changed
            setErrors(prevErrors => ({ ...prevErrors, password1: null, general: null }))
        } else {
            setErrors(prevErrors => ({ ...prevErrors, [name]: null, general: null }))
        }
        setMsg(defautltMsg) // Set message to default
    }

    useEffect(() => {
        const errorExists = errors.email || errors.password1 || errors.general || false
        const {email, password1, password2} = formData
        const emptyInput = email === '' || password1 === '' || password2 === ''
        if (waiting || emptyInput || success || errorExists){
            setDisabled(true)
        } else {
            setDisabled(false)
        }
    }, [waiting, success, errors, formData])

    
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const {email, password1, password2} = formData
        if (password1 !== password2){
            return setErrors({...errors, password1: 'Password and confirm password must match.'})
        } 
        try {
            setWaiting(true)
            const result = await signup({ email, password: password1 });
            if ('errors' in result){
                const emailError = parseErrors(result.errors, 'email')
                const pwdError = parseErrors(result.errors, 'password')
                setErrors({...errors, email: emailError, password1: pwdError})
                
            } else {
                setMsg(result.message)
                setSuccess(true)
            }
            setWaiting(false)
        } catch (err){
            setErrors({general: 'Currently unable to signup due to system issues.', email: null, password1: null})
        }
    }

  return (
        <Card>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-80">
                <Input
                    value={formData.email}
                    onChange={handleChange}
                    name="email"
                    placeholder="Email"
                    disabled={waiting}
                    aria-label="email"
                />
                {errors.email && <p role='alert'>{errors.email}</p>}
                <Input
                    type="password"
                    value={formData.password1}
                    onChange={handleChange}
                    name="password1"
                    placeholder="Password"
                    disabled={waiting}
                    aria-label="password"
                />
                <Input
                    type="password"
                    value={formData.password2}
                    onChange={handleChange}
                    name="password2"
                    placeholder="Confirm Password"
                    disabled={waiting}
                    aria-label="confirm password"
                />
                {errors.password1 && <p role='alert'>{errors.password1}</p>}

                <SubmitButton disabled={disabled} text={waiting? 'Signing up...' : 'Sign up'}/>

                {errors.general && <p role='alert'>{errors.general}</p>} 

                <div className="text-center">
                    <span className="text-gray-500">{msg} </span>
                    <Link 
                        href={`/auth/${waiting? 'signup' : 'login'}`}
                        className={waiting? 'text-gray-500 pointer-events-none' :"hover:underline text-blue-500"}>
                        Login
                    </Link>
                </div>
            </form>
        </Card>
    )
}