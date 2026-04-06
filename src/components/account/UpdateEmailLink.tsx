import { useCurrentUser } from "@/contexts/CurrentUserContext"
import { useRouter } from "next/navigation"
import { faCheck as check } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../forms/Button";
import { Input } from "../forms/Input";

export default function UpdateEmailLink () {
    const router = useRouter()
    const { currentUser } = useCurrentUser()
    const email = currentUser?.email
    const isVerified = currentUser?.isVerified

    return (
        <form className="flex flex-col gap-2">
            <label htmlFor="email">
                Email: {isVerified ? 
                    <span className="text-xs text-gray-500">
                        Verified <FontAwesomeIcon icon={check} className='text-green-500' />
                    </span>
                :
                    <span className="text-xs text-gray-500">Not verified </span>
                }</label>
            <Input
                type='text'
                name='email'
                value={email}
                disabled
                className='p-2 bg-gray-100'
            />
            <Button type='button' onClick={() => router.replace('/account/update/email')} text="Update Email" />
        </form>
    )
}