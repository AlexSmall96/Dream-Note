"use client"
import { requestPasswordReset, verifyResetOTP } from "@/lib/api/auth";
import EmailForm from "@/components/forms/EmailForm"
import Image from "next/image"

export default function RequestPasswordReset () {

    return (
        <div className="flex flex-col items-center">
            <Image
                alt="crescent moon"
                width={100}
                height={100}
                src="/images/moon.png"
            />
            <h1 className="text-2xl font-semibold px-2 mb-4 text-center">
                Lost in a Dream? Let’s Find Your Way Back.
            </h1>
            <EmailForm<{otp: string, email: string}> 
                emailPlaceholder='Enter your email address'
                emailButtonText='recover your password'
                requestFn={requestPasswordReset} 
                verifyFn={verifyResetOTP} 
                buildVerifyPayload={(otp, email) => ({otp, email})} 
            />  
        </div>
    )
}
