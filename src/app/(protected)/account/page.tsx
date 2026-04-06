"use client"
import PasswordForm from "@/components/account/PasswordForm";
import UpdateEmailLink from "@/components/account/UpdateEmailLink";
import VerifyEmail from "@/components/account/VerifyEmail";
import LinkWithMessage from "@/components/forms/LinkWithMessage";
import { Card } from "@/components/ui/Card";
import { useCurrentUser } from "@/contexts/CurrentUserContext";
import { faTriangleExclamation as faWarn } from "@fortawesome/free-solid-svg-icons";

export default function Account(){
    const { isGuest, currentUser } = useCurrentUser()

    const isVerified = currentUser?.isVerified

    return (
        <div className="flex flex-col items-center mt-2">
            <h1 className="text-lg font-bold text-center h-12">Account</h1>
            <Card className="w-full max-w-xl mt-0.5">
                {!isGuest ?
                <>
                    <UpdateEmailLink />
                    {isVerified ? 
                    <>
                        <PasswordForm />
                        <LinkWithMessage href='/account/delete' linkText='Delete Account' icon={faWarn} danger />
                    </> 
                    :
                        <VerifyEmail />
                    }
                </>
                : 
                    <>
                        <p className="text-center">Email and password updates and account deletion are disabled for guests. Create an account to access these features.</p>
                    </>
                }
            </Card>
        </div>
    )
}