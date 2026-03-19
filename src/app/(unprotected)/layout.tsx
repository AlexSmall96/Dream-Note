import UnprotectedNavbar from "@/components/nav/UnprotectedNavbar"
import RootClientWrapper from "../RootClientWrapper"

export default function UnprotectedLayout({ children }: { children: React.ReactNode }) {
    return (
        <RootClientWrapper>
            <UnprotectedNavbar />
            <main>{children}</main>
        </RootClientWrapper>
    )
}