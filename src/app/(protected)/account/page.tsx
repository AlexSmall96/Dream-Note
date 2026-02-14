"use client"
import PasswordForm from "@/components/account/PasswordForm";
import { useCurrentUser } from "@/contexts/CurrentUserContext";

export default function Profile(){
    const {isGuest} = useCurrentUser()

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-l font-bold m-4">Profile</h1>
            {!isGuest ?
                <PasswordForm /> 
            : 
                <>
                    Email and password updates and account deletion are disabled for guests. Create an account to access these features.
                </>
            }
        </div>
    )
}