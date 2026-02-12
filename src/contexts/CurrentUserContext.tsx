"use-client"
import { fetchCurrentUser } from '@/lib/api/auth'
import { setterFunction } from '@/types/setterFunctions'
import { createContext, useState, useEffect, useContext} from 'react'

type user = {
    id: string, email: string
}

type UserContextType = {
    currentUser: user | null,
    setCurrentUser: setterFunction<user | null>,
    loading: boolean,
}

const CurrentUserContext = createContext<UserContextType | null>(null)

export function CurrentUserProvider({children}: { children: React.ReactNode }){
    
    const [currentUser, setCurrentUser] = useState<user | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                const result = await fetchCurrentUser()
                if (!('errors' in result)){
                    setCurrentUser(result)
                } else {
                    setCurrentUser(null)
                }
            } catch (err){
                setCurrentUser(null)
                
            }
            setLoading(false)
        }
        getCurrentUser()
    }, [])
    
    return (
        <CurrentUserContext.Provider value={{ currentUser, setCurrentUser, loading }}>
            {children}
        </CurrentUserContext.Provider>
    )
}

export function useCurrentUser(){
    const context = useContext(CurrentUserContext)

    if (!context){
        throw new Error('useCurrentUser must be used within a CurrentUserProvider')
    }

    return context   
}