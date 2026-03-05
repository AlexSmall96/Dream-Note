"use client"
import PasswordForm from "@/components/account/PasswordForm";
import UpdateEmailLink from "@/components/account/UpdateEmailLink";
import VerifyEmail from "@/components/account/VerifyEmail";
import { useCurrentUser } from "@/contexts/CurrentUserContext";

export default function Account(){
    const { isGuest, currentUser } = useCurrentUser()

    if (!currentUser) return null

    const {email, isVerified} = currentUser

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-l font-bold m-4">Account</h1>
            {!isGuest ?
            <>
                <UpdateEmailLink email={email} />
                {isVerified ?  
                    <PasswordForm />
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