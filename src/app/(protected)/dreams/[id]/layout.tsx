import { DreamViewProvider } from '@/contexts/DreamViewContext.js'

export default function Layout({ children }: { children: React.ReactNode}){
    return (
        <DreamViewProvider>
            {children}
        </DreamViewProvider>
    )
}