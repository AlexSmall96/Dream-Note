'use client'
import DeleteAccount from "@/components/account/DeleteAccount";

export default function DeleteAccountPage(){

    return (
        <div className="flex flex-col items-center m-5">
            Confirm your password to delete account.
            <DeleteAccount />
        </div>
    )
}