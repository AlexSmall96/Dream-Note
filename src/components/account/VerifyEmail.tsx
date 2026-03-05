
export default function VerifyEmail(){

    return (
        <form className="flex flex-col gap-2 w-80">
            <p>Please verify your email to perform password updates and account deletion.</p>
            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 m-2'>Verify Email</button>
        </form>
    )
}