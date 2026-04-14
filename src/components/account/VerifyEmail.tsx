import { useCurrentUser } from "@/contexts/CurrentUserContext"
import { requestEmailVerification, verifyEmail } from "@/lib/api/account"
import { useState } from "react"
import { Input } from "../forms/Input"
import Button from "../forms/Button"

export default function VerifyEmail(){

    const [errors, setErrors] = useState<{email: string, otp: string}>({email: '', otp: ''})
    const [otp, setOtp] = useState('')
    const [verifying, setVerifying] = useState(false)
    const [resending, setResending] = useState(false)
    const {setCurrentUser} = useCurrentUser()

    const handleResend = async () => {
        setResending(true)
        try {
            const result = await requestEmailVerification()
            if ('errors' in result){
                setErrors({...errors, email:result.errors[0].msg})
            }
        } catch (err){
            setErrors({...errors, email:'Currently unable to send email due to system issues.'})
        } finally {
            setResending(false)
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOtp(event.target.value)
        setErrors({email: '', otp: ''})
    }

    const handleVerify = async (event: React.FormEvent) => {
        event.preventDefault()
        setVerifying(true)
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
        } finally {
            setVerifying(false)
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
                disabled={verifying || resending}
            />
            <p className="text-red-500">{errors.otp ?? ''}</p>
            <Button type='submit' text={verifying ? 'Verifying...' : 'Verify OTP'} disabled={verifying || resending} />
            <Button type='button' onClick={handleResend} text={resending ? 'Resending...' : 'Resend Verification Email'} disabled={verifying || resending} />
            <p className="text-red-500">{errors.email ?? ''}</p>
        </form>
    )
}
