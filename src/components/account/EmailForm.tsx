"use client"
import { useState } from 'react';
import { requestEmailUpdate, verifyOTPAndUpdateEmail } from '@/lib/api/account';

export default function EmailForm(){
    const [email, setEmail] = useState('');
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [otpSent, setOtpSent] = useState(false)
    const [otp, setOtp] = useState('')

    // Sends a otp to the provided email address
    const handleSendOtp = async (event: React.FormEvent) => {
        event.preventDefault()
        try {
            const result = await requestEmailUpdate(email)
            if ('error' in result){
                setError(result.error)
            } else {
                setMessage(result.message)
                setOtpSent(true)
            }
        } catch (err){
            setError('Currently unable to send OTP due to system issues. Please try again later.')
        }
    }

    // Verifies otp entered into form against backend
    // Updates email address if otp is valid
    const handleVerifyOtp = async (event: React.FormEvent) => {
        event.preventDefault()
        try {
            const result = await verifyOTPAndUpdateEmail(otp)
            if ('error' in result){
                setError(result.error)
            } else {
                setMessage(result.message)
                setOtp('')
                setEmail('')
                setOtpSent(false)
            }
        } catch (err){
            setError('Currently unable to verify OTP due to system issues. Please try again later.')
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        if (name === 'email'){
            setEmail(value)
        } else if (name === 'otp'){
            setOtp(value)
        }
        setMessage('') // Clear success message if user inputs new data
        setError('') // Clear error message if user inputs new data
    }

    return (
        <form onSubmit={!otpSent? handleSendOtp : handleVerifyOtp} className="flex flex-col gap-2 w-80">
            {!otpSent?
                <>
                    <input 
                        type='email'
                        name='email'
                        value={email}
                        onChange={handleChange}
                        placeholder='Enter new email'
                        className='bg-blue-100 p-2'
                    />
                </> 
            :   
                <>     
                    <input 
                        type='text'
                        name='otp'
                        value={otp}
                        onChange={handleChange}
                        placeholder='Enter OTP'
                        className='bg-blue-100 p-2'
                    />
                </>
            }
                {message ?? ''}
                {error && <p className="text-red-500">{error}</p>}
                <button type='submit' className='bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 m-2'>
                    {!otpSent ? 'Send OTP to Verify New Email' : 'Verify OTP'}
                </button>
        </form>
    )
}