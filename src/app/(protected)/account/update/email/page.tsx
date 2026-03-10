"use client"
import EmailForm from "@/components/forms/EmailForm";
import { requestEmailUpdate, verifyOTPAndUpdateEmail } from "@/lib/api/account";

export default function UpdateEmail(){

    return (
        <div className="flex flex-col items-center m-4">
            <EmailForm<{otp: string}> 
                emailPlaceholder='Enter new email'
                emailButtonText='verify your new email'
                requestFn={requestEmailUpdate} 
                verifyFn={verifyOTPAndUpdateEmail}
                buildVerifyPayload={(otp, _email) => ({otp})}
            />   
        </div>
    )
}