import { useCurrentUser } from "@/contexts/CurrentUserContext"
import { requestEmailVerification, verifyEmail } from "@/lib/api/account"
import { useState } from "react"
import { Input } from "../forms/Input"
import Button from "../forms/Button"

export default function VerifyEmail(){

    const [errors, setErrors] = useState<{email: string, otp: string}>({email: '', otp: ''})
    const [otp, setOtp] = useState('')
    const {setCurrentUser} = useCurrentUser()

    const handleResend = async () => {
        try {
            const result = await requestEmailVerification()
            if ('errors' in result){
                setErrors({...errors, email:result.errors[0].msg})
            }
        } catch (err){
            setErrors({...errors, email:'Currently unable to send email due to system issues.'})
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOtp(event.target.value)
        setErrors({email: '', otp: ''})
    }

    const handleVerify = async (event: React.FormEvent) => {
        event.preventDefault()
        try {
            const result = await verifyEmail(otp)
            if ('errors' in result){
                setErrors({...errors, otp:result.errors[0].msg})
            } else {
                setCurrentUser(prev => {
                    if (!prev) return prev;
                    return { ...prev, isVerified: true };
                });
            }
        } catch (err) {
            setErrors({...errors, email:'Currently unable to verify otp due to system issues.'})
        }
    }


    return (
        <form className="flex flex-col gap-2" onSubmit={handleVerify}>
            <p className="mt-2 text-sm">Email address must be verified to perform password updates and account deletion.</p>
            <p className="text-sm">Please enter the OTP that was sent to your email address for verification.</p>
            <Input 
                type='text'
                name='otp'
                value={otp}
                onChange={handleChange}
                placeholder='Enter OTP'
                className='bg-blue-100 p-2'
            />
            <p className="text-red-500">{errors.otp ?? ''}</p>
            <Button type='submit' text='Verify OTP' />
            <Button type='button' onClick={handleResend} text='Resend Verification Email' />
            <p className="text-red-500">{errors.email ?? ''}</p>
        </form>
    )
}
