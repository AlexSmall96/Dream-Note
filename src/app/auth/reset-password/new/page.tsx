'use client'
import ResetPasswordForm from "@/components/auth/ResetPasswordForm"
import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation";
import { verifyResetToken } from "@/lib/api/auth";

export default function NewPasswordPage (){
    const searchParams = useSearchParams()
    const [loading, setLoading] = useState(true)
    const token = searchParams.get('token')
    const router = useRouter();

    useEffect(() => {
        const checkTokenIsValid = async () => {
            try {
                if (!token){
                    throw null
                }
                const result = await verifyResetToken(token)
                if ('errors' in result){
                    throw null
                }
                    setLoading(false)
            } catch (err){
                // Throw null errors above to trigger catch block and redirect to request reset page if token is invalid
                return router.push('/auth/reset-password')
            }
        }
        checkTokenIsValid()
    }, [token, router])

    if (loading){
        return (
            <div className="flex flex-col items-center m-4">
                Loading...
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center m-4">
            <h1 className="m-2">
                One time passcode correct. Enter your new password below.
            </h1>
                <ResetPasswordForm token={token!} />
        </div>
    )
}