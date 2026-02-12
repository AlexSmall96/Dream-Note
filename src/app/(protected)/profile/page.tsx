"use client"
import ProfileForm from "@/components/profile/ProfileForm";
import { useCurrentUser } from "@/contexts/CurrentUserContext";

export default function Profile(){
    const {isGuest} = useCurrentUser()

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-l font-bold m-4">Profile</h1>
            {!isGuest ?
                <ProfileForm /> 
            : 
                <>
                    Email and password updates and account deletion are disabled for guests. Create an account to access these features.
                </>
            }
        </div>
    )
}