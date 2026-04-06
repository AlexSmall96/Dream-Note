'use client'
import DeleteAccount from "@/components/account/DeleteAccount";

export default function DeleteAccountPage(){

    return (
        <div className="flex flex-col items-center mt-2">
            <h1 className="text-lg font-bold text-center h-16 px-2 md:h-12">Confirm your password to delete account</h1>
            <DeleteAccount />
        </div>
    )
}