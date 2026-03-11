import { Card } from '@/components/ui/Card'
import { Input } from '@/components/forms/Input'
import { useState } from 'react'
import Button from '../forms/Button'
import { deleteAccount } from '@/lib/api/account'
import { useRouter } from 'next/navigation'
import { faTriangleExclamation as faWarn } from "@fortawesome/free-solid-svg-icons";
import { useCurrentUser } from '@/contexts/CurrentUserContext'

export default function DeleteAccount() {
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [waiting, setWaiting] = useState(false)
    const router = useRouter()
    const { setCurrentUser } = useCurrentUser()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
        setError(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setWaiting(true)
        try {
            const result = await deleteAccount(password)
            if ('errors' in result){
                return setError(result.errors[0].msg)
            }
            setCurrentUser(null)
            router.push('/')
        } catch (err) {
            setError('Currently unable to delete account due to system issues.')
        } finally{
            setWaiting(false)
        }
    }

    return (
        <Card>
            <form onSubmit={handleSubmit} className='flex flex-col gap-2 w-80'>
                <Input 
                    name='password'
                    aria-label='Password'
                    placeholder='Enter password'
                    type='password'
                    value={password}
                    onChange={handleChange}
                    disabled={waiting}
                />
                {error && <p role='alert' className='text-red-500'>{error}</p>}
                <Button 
                    text='Delete Account'
                    disabled={password === '' || error !== null || waiting}
                    danger
                    icon={faWarn}
                />
            </form>
        </Card>
    )
}