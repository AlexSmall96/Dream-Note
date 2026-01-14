import { DreamViewProvider } from '@/contexts/DreamViewContext'

export default function Layout({ children }: { children: React.ReactNode}){
    return (
        <DreamViewProvider>
            {children}
        </DreamViewProvider>
    )
}