import { requestEmailVerification } from "@/lib/api/account"
import { useState } from "react"

export default function VerifyEmail(){

    const [msg, setMsg] = useState('')

    const handleVerify = async () => {
        try {
            const result = await requestEmailVerification()
            if ('errors' in result){
                setMsg(result.errors[0].msg)
            } else {
                setMsg(result.message)
            }
        } catch (err){
            console.log(err)
        }
    }

    return (
        <form className="flex flex-col gap-2 w-80">
            <p>Please verify your email to perform password updates and account deletion.</p>
            <button type='button' onClick={handleVerify} className='bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 m-2'>Verify Email</button>
            {msg ?? ''}
        </form>
    )
}
