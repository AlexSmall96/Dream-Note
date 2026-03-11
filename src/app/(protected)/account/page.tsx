"use client"
import PasswordForm from "@/components/account/PasswordForm";
import UpdateEmailLink from "@/components/account/UpdateEmailLink";
import VerifyEmail from "@/components/account/VerifyEmail";
import LinkWithMessage from "@/components/forms/LinkWithMessage";
import { useCurrentUser } from "@/contexts/CurrentUserContext";
import { faTriangleExclamation as faWarn } from "@fortawesome/free-solid-svg-icons";

export default function Account(){
    const { isGuest, currentUser } = useCurrentUser()

    const isVerified = currentUser?.isVerified

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-l font-bold m-4">Account</h1>
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
                    Email and password updates and account deletion are disabled for guests. Create an account to access these features.
                </>
            }
        </div>
    )
}