'use client'
import ResetPasswordForm from "@/components/auth/ResetPasswordForm"

export default function NewPasswordPage (){
    return (
        <div className="flex flex-col items-center m-4">
            <h1 className="m-2">
                One time passcode correct. Enter your new password below.
            </h1>
            <ResetPasswordForm />
        </div>
    )
}