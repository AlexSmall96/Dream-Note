import { useRouter } from "next/navigation"

export default function UpdateEmailLink ({email}:{email:string}) {
    const router = useRouter()
    
    return (
        <>
            <label htmlFor="email" className='m-2'>Email:</label>
            <input
                type='text'
                name='email'
                value={email}
                disabled
                className='p-2 bg-gray-100'
            />
            <button type='button' onClick={() => router.replace('/account/update/email')} className='bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 m-2'>Update Email</button>
        </>
    )
}