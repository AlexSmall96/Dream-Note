"use client"
import EmailForm from "@/components/account/EmailForm";
import { requestEmailUpdate, verifyOTPAndUpdateEmail } from "@/lib/api/account";

export default function UpdateEmail(){

    return (
        <div className="flex flex-col items-center m-4">
            <EmailForm<{otp: string}> 
                requestFn={requestEmailUpdate} 
                verifyFn={verifyOTPAndUpdateEmail} 
                buildVerifyPayload={(otp, _email) => ({otp})}
            />   
        </div>
    )
}