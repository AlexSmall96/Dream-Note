'use client'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from "react"
import SubmitButton from "../ui/SubmitButton"
import { resetPassword } from '@/lib/api/account'

export default function ResetPasswordForm () {

    const [formData, setFormData] = useState({
        password1: '', password2: ''
    })
    const [disabled, setDisabled] = useState(true)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

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
        if (!token){
            return
        }
        try {
            const result = await resetPassword(formData.password1, token)
            if ('error' in result){
                return setError(result.error)
            }
            if ('errors' in result){
                return setError(result.errors[0].msg)
            }
            setMessage(result.message)
        } catch (err){
            setError('Currently unable to change password due to system issues. Please try again later.')
        }
    }

    return (
        <form className='flex flex-col gap-2 w-80' onSubmit={handleSubmit}>
            <input 
                name='password1'
                value={formData.password1}
                type='password'
                placeholder="Enter your new password."
                onChange={handleChange}
            />
            <input 
                name='password2'
                value={formData.password2}
                type='password'
                placeholder="Confirm your new password."
                onChange={handleChange}
            />
            {error ?? ''}
            {message ?? ''}
            <SubmitButton text={'Change password'} disabled={disabled} />
        </form>
    )
}