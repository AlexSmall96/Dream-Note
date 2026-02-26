'use client'
import ResetPasswordForm from "@/components/auth/ResetPasswordForm"
import { Suspense } from 'react'

export default function NewPasswordPage (){
    return (
        <div className="flex flex-col items-center m-4">
            <h1 className="m-2">
                One time passcode correct. Enter your new password below.
            </h1>
            <Suspense fallback={<div>Loading form...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    )
}