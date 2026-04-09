'use client'
import { useState, useEffect } from "react"
import { resetPassword } from '@/lib/api/auth'
import { Card } from "../ui/Card";
import { Input } from "../forms/Input";
import LinkWithMessage from "../forms/LinkWithMessage";
import Button from "../forms/Button";

export default function ResetPasswordForm ({token}:{token: string}) {

    const [formData, setFormData] = useState({
        password1: '', password2: ''
    })
    const [disabled, setDisabled] = useState(true)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [invalidSession, setInvalidSession] = useState(false)
    const [waiting, setWaiting] = useState(false)
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData, [event.target.name]: event.target.value
		})
        setMessage('') // Clear success message if user inputs new data
	} 

    useEffect(() => {
        const {password1, password2} = formData
        setDisabled(!password1 || password1 !== password2)
        // Set feedback message
        if (password1 && password2 && password1 !== password2){
            setError('New password and confirm password must match.')
        }
        // Clear feedback message if passwords match or any input is empty
        if (password1 === password2 || !password1 || !password2){
            setError('')
        }
    }, [formData])

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        setWaiting(true)
        if (!token){
            return
        }
        try {
            const result = await resetPassword(formData.password1, token)
            if ('errors' in result && result.errors[0].msg === 'Invalid reset session.'){
                return setInvalidSession(true)
            }
            if ('errors' in result){
                return setError(result.errors[0].msg)
            }
            setMessage(result.message)
        } catch (err){
            setError('Currently unable to change password due to system issues. Please try again later.')
        } finally {
            setWaiting(false)
        }
    }

    return (
        <>
            {!message &&
                <h1 className="text-2xl font-semibold px-2 mb-4 text-center">
                    One time passcode correct. Enter your new password below.
                </h1>
            }
            <Card className="w-full max-w-md">
                <form className='flex flex-col gap-2' onSubmit={handleSubmit}>
                    <Input
                        name='password1'
                        value={formData.password1}
                        type='password'
                        placeholder="Enter your new password."
                        onChange={handleChange}
                        aria-label='password'
                        disabled={waiting}
                    />
                    <Input 
                        name='password2'
                        value={formData.password2}
                        type='password'
                        placeholder="Confirm your new password."
                        onChange={handleChange}
                        aria-label='confirm password'
                        disabled={waiting}
                    />
                    {error && <p role="alert" className="text-red-500">{error}</p>}

                    {message && <LinkWithMessage href='/auth/login' linkText="Login" msg={message} />}

                    {!message && !invalidSession ? 
                        <Button text={waiting ? 'Changing password...' : 'Change password'} disabled={disabled || waiting} /> 
                    : 
                        invalidSession ? 
                            <LinkWithMessage href='/auth/reset-password' linkText="Request new password reset" msg={'Reset session invalid.'} />
                        :
                            <LinkWithMessage href='/auth/reset-password' linkText="Reset Password" msg={'Need to change your password again?'} />
                    }
                </form>
            </Card>
        </>
    )
}