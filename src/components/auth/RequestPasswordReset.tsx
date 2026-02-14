export default function RequestPasswordReset () {
    return (
        <form className="flex flex-col gap-2 w-80">
            <input 
                type='email'
                placeholder="Enter the email address associated with your account."
            />
        </form>
    )
}