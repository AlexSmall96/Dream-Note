"use client"
import { requestPasswordReset, verifyResetOTP } from "@/lib/api/auth";
import EmailForm from "@/components/account/EmailForm"

export default function RequestPasswordReset () {

    return (
        <div className="flex flex-col items-center m-4">
            <EmailForm<{otp: string, email: string}> 
                emailPlaceholder='Enter your email address'
                emailButtonText='Send OTP to recover your password'
                requestFn={requestPasswordReset} 
                verifyFn={verifyResetOTP} 
                buildVerifyPayload={(otp, email) => ({otp, email})} 
            />  
        </div>
    )
}
