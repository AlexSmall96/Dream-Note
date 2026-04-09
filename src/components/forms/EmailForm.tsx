import { useEffect, useState } from 'react';
import { resetTokenRes } from '@/types/accounts';
import { useRouter } from "next/navigation"
import { ErrorResponse, SuccessResponse } from '@/types/responses';
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/forms/Input'
import Button from '@/components/forms/Button'

export type requestFnType = (email:string) => Promise<ErrorResponse | SuccessResponse>

export default function EmailForm<TVerifyPayload>({
    emailPlaceholder,
    emailButtonText,
    requestFn, 
    verifyFn,
    buildVerifyPayload
}:{
    emailPlaceholder: string,
    emailButtonText: string,
    requestFn: requestFnType,
    verifyFn: (data: TVerifyPayload) => Promise<ErrorResponse | SuccessResponse | resetTokenRes> 
    buildVerifyPayload: (otp:string, email:string) => TVerifyPayload
}){
    const [email, setEmail] = useState('');
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [otpSent, setOtpSent] = useState(false)
    const [otp, setOtp] = useState<string>('')
    const router = useRouter()
    const [disabled, setDisabled] = useState(true)
    const [waiting, setWaiting] = useState(false)
    const defaultBtnText = `Send OTP to ${emailButtonText}`
    const [btnText, setBtnText] = useState(defaultBtnText)

    // Sends a otp to the provided email address
    const handleSendOtp = async (event: React.FormEvent) => {
        event.preventDefault()
        setWaiting(true)
        try {
            const result = await requestFn(email)
            if ('errors' in result){
                console.log(result)
                return setError(result.errors[0].msg)
            }
            setMessage(result.message)
            setOtpSent(true)
        } catch (err){
            setError('Currently unable to send OTP due to system issues. Please try again later.')
        } finally {
            setWaiting(false)
        }
    }

    // Verifies otp entered into form against backend
    // Updates email address or redirects to password reset page if otp is valid
    const handleVerifyOtp = async (event: React.FormEvent) => {
        event.preventDefault()
        if (!email){
            return
        }
        try {
            setWaiting(true)
            const result = await verifyFn(buildVerifyPayload(otp, email))
            if ('errors' in result){
                setWaiting(false)
                setDisabled(true)
                return setError(result.errors[0].msg)
            }
            if ('resetToken' in result){
                return router.replace(`/auth/reset-password/new?token=${result.resetToken}`)
            }
            setMessage(result.message)
            setOtp('')
            setEmail('')
            setOtpSent(false)
            setWaiting(false)
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

    useEffect(() => {
        if (waiting && !otpSent){
            setBtnText('Sending OTP...')
        }
        if (waiting && otpSent){
            setBtnText('Verifying OTP...')
        }
        if (!waiting && otpSent){
            setBtnText('Verify OTP')
        }
        if (!waiting && !otpSent){
            setBtnText(defaultBtnText)
        }
    }, [waiting, otpSent])
    
    return (
        <Card className='w-full max-w-md'>
            <form onSubmit={!otpSent? handleSendOtp : handleVerifyOtp} className="flex flex-col gap-2">
                {!otpSent?
                    <>
                        <Input
                            type='email'
                            name='email'
                            value={email}
                            onChange={handleChange}
                            placeholder={emailPlaceholder}
                            className='bg-blue-100 p-2'
                            disabled={waiting}
                            aria-label='email'
                        />
                    </> 
                :   
                    <>     
                        <Input 
                            type='text'
                            name='otp'
                            value={otp}
                            onChange={handleChange}
                            placeholder='Enter OTP'
                            className='bg-blue-100 p-2'
                            disabled={waiting || error !== ''}
                            aria-label='otp'
                        />
                    </>
                }
                    {message && <p>{message}</p>}
                    {error && <p role='alert' className="text-red-500">{error}</p>}
                    <Button
                        text={btnText}
                        disabled={disabled || waiting || (otpSent && !otp)}
                    />
            </form>
        </Card>
    )
}