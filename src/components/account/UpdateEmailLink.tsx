import { useCurrentUser } from "@/contexts/CurrentUserContext"
import { useRouter } from "next/navigation"
import { faCheck as check } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function UpdateEmailLink () {
    const router = useRouter()
    const { currentUser } = useCurrentUser()
    const email = currentUser?.email
    const isVerified = currentUser?.isVerified

    return (
        <form className="flex flex-col gap-2 w-80">
            <label htmlFor="email" className='m-2'>
                Email: {isVerified ? 
                    <span className="text-xs text-gray-500">
                        Verified <FontAwesomeIcon icon={check} className='text-green-500' />
                    </span>:''
                }</label>
            <p></p>
            <p></p>
            <input
                type='text'
                name='email'
                value={email}
                disabled
                className='p-2 bg-gray-100'
            />
            <button type='button' onClick={() => router.replace('/account/update/email')} className='bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 m-2'>Update Email</button>
        </form>
    )
}