import ResetPasswordForm from '@/components/auth/ResetPasswordForm'
import { redirect } from 'next/navigation'
import { verifyResetToken } from '@/lib/api/auth'

export default async function NewPasswordPage({
    searchParams,
}: {
    searchParams: { token?: string }
}) {
    const token = searchParams.token

    if (!token) {
        redirect('/auth/reset-password')
    }

    const result = await verifyResetToken(token)

    if ('errors' in result) {
        redirect('/auth/reset-password')
    }

    return (
        <div className="flex flex-col items-center m-4">
            <h1 className="m-2">
                One time passcode correct. Enter your new password below.
            </h1>
            <ResetPasswordForm token={token} />
        </div>
    )
}