"use client"
import { useCurrentUser } from "@/contexts/CurrentUserContext"
import { updateProfile } from "@/lib/api/profile"
import { useEffect, useState } from "react"

export default function ProfileForm(){

    const {currentUser} = useCurrentUser()
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [disabled, setDisabled] = useState(true)

    // 3 inputs required: current password, new password and confirm new password
    type formDataType = {
            password0: string,
            password1: string,
            password2: string     
    }
    const [formData, setFormData] = useState<formDataType>({
            password0: '',
            password1: '',
            password2: ''
    })

    const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData, [event.target.name]: event.target.value
		})
        setMessage('') // Clear success message if user inputs new data
	}   

    // Disable submit button if any password field is empty or if new passwords don't match
    useEffect(() => {
        const {password0, password1, password2} = formData
        setDisabled(!password0 || !password1 || password1 !== password2)
        // Set feedback message
        if (password0 && password1 && password2 && password1 !== password2){
            setError('New password and confirm password must match.')
        }
        // Clear feedback message if passwords match or any input is empty
        if (password1 === password2 || !password1 || !password2 || !password0){
            setError('')
        }
    }, [formData])

    const handlePasswordSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        try {
            const result = await updateProfile({
                currPassword: formData.password0,
                password: formData.password1
            })
            if ('errors' in result){
                setError(result.errors[0].msg)
            } else {
                // No errors - set success message and clear form
                setMessage('Password updated succesfully.')
                setFormData({
                    password0: '',
                    password1: '',
                    password2: ''
                })
            }
        }
        catch (err){
            setError('Currently unable to change password due to system issues. Please try again later.')
        }
    }

    return (
        currentUser ? 
            <form className="flex flex-col gap-2 w-80" onSubmit={handlePasswordSubmit}>  
                <label htmlFor="email" className='m-2'>Email:</label>
                <input
                    type='text'
                    name='email'
                    value={currentUser.email}
                    disabled
                    className='p-2 bg-gray-100'
                />
                <button type='button' className='bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 m-2'>Update Email</button>
                <input 
                    type='password'
                    name='password0'
                    value={formData.password0}
                    placeholder="Enter current password"
                    onChange={handleChangePassword}
                />
                <input 
                    type='password'
                    name='password1'
                    value={formData.password1}
                    placeholder="Enter new password"
                    onChange={handleChangePassword}
                />
                <input 
                    type='password'
                    name='password2'
                    value={formData.password2}
                    placeholder="Confirm new password"
                    onChange={handleChangePassword}
                />
                {error ?? ''}
                {message ?? ''}
                <button type='submit' className={`bg-${disabled ? 'gray-400' : 'blue-500 hover:bg-blue-700'} text-white font-bold p-2 m-2`} disabled={disabled}>Change Password</button>
            </form>
        :
            null
    )
}