"use client"
import { requestPasswordReset, verifyResetOTP } from "@/lib/api/account";
import EmailForm from "@/components/account/EmailForm"

export default function RequestPasswordReset () {

    return (
        <div className="flex flex-col items-center m-4">
            <EmailForm<{otp: string, email: string}> 
                requestFn={requestPasswordReset} 
                verifyFn={verifyResetOTP} 
                buildVerifyPayload={(otp, email) => ({otp, email})} 
            />  
        </div>
    )
}
