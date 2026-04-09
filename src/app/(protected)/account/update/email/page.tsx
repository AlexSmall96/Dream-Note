"use client"
import EmailForm from "@/components/forms/EmailForm";
import { requestEmailUpdate, verifyOTPAndUpdateEmail } from "@/lib/api/account";
import Image from "next/image"

export default function UpdateEmail(){

    return (
        <div className="flex flex-col items-center">
            <div className="flex flex-row items-center text-2xl font-semibold pb-2">
                <Image
                    alt="pillow"
                    width={100}
                    height={100}
                    src="/images/pillow.png"
                />
                <h1>Stay Connected to Your Dreams</h1>
            </div>
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