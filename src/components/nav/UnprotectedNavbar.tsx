import LinkWithIcon from "../ui/LinkWithIcon";
import { faUserPlus as faSignup, faRightToBracket as faLogin } from "@fortawesome/free-solid-svg-icons";
import Logo from "./Logo";

export default function UnprotectedNavbar() {
    return (
        <nav className="w-full border-b bg-purple-200 p-4">
            <div className="max-w-5xl mx-auto flex justify-between items-center">
                <Logo />
                <div className="flex gap-4">
                    <LinkWithIcon href='/auth/login' text="Login" icon={faLogin} />
                    <LinkWithIcon href='/auth/signup' text="Sign Up" icon={faSignup} />
                </div>
            </div>
        </nav>        
    )
}