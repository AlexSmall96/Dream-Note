
import { useState } from 'react';
import { accountError, accountMessage, resetTokenRes, accountErrorArray } from '@/types/accounts';
import { useRouter } from "next/navigation"
import SubmitButton from '../ui/SubmitButton';

export default function EmailForm<TVerifyPayload>({
    requestFn, 
    verifyFn,
    buildVerifyPayload
}:{
    requestFn: (email:string) => Promise<accountError | accountErrorArray | accountMessage>
    verifyFn: (data: TVerifyPayload) => Promise<accountError | accountErrorArray | accountMessage | resetTokenRes> 
    buildVerifyPayload: (otp:string, email:string) => TVerifyPayload
}){
    const [email, setEmail] = useState('');
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [otpSent, setOtpSent] = useState(false)
    const [otp, setOtp] = useState('')
    const router = useRouter()
    const [disabled, setDisabled] = useState(true)

    // Sends a otp to the provided email address
    const handleSendOtp = async (event: React.FormEvent) => {
        event.preventDefault()
        try {
            const result = await requestFn(email)
            if ('error' in result){
                return setError(result.error)
            } 
            if ('errors' in result){
                return setError(result.errors[0].msg)
            }
            setMessage(result.message)
            setOtpSent(true)
        } catch (err){
            setError('Currently unable to send OTP due to system issues. Please try again later.')
        }
    }

    // Verifies otp entered into form against backend
    // Updates email address if otp is valid
    const handleVerifyOtp = async (event: React.FormEvent) => {
        event.preventDefault()
        if (!email){
            return
        }
        try {
            const result = await verifyFn(buildVerifyPayload(otp, email))
            if ('error' in result){
                return setError(result.error)
            }
            if ('errors' in result){
                return setError(result.errors[0].msg)
            }
            if ('resetToken' in result){
                return  router.replace(`/auth/reset-password/new?token=${result.resetToken}`)
            }
            setMessage(result.message)
            setOtp('')
            setEmail('')
            setOtpSent(false)
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
        setDisabled(value === '')
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
                <SubmitButton 
                    text={!otpSent ? 'Send OTP to Verify New Email' : 'Verify OTP'}
                    disabled={disabled}
                />
        </form>
    )
}