"use client"
import { AsideContent } from '@/components/nav/AsideContent';
import { useCurrentUser } from '@/contexts/CurrentUserContext';
export default function Aside() {
    const { loading, currentUser } = useCurrentUser()

    return (
        loading || !currentUser? 
            null 
        :
        <AsideContent />
  )
}
