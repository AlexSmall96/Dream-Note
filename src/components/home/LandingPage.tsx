"use client"
import { useCurrentUser } from "@/contexts/CurrentUserContext"
import { loginGuest } from "@/lib/api/auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Image from 'next/image';
import Button from "../forms/Button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faGithub, faLinkedin} from "@fortawesome/free-brands-svg-icons"

export default function LandingPage(){

    const router = useRouter()
    const {currentUser, loading } = useCurrentUser()

    // Redirect to dreams dashboard if logged in
    useEffect(() => {
        if (!loading && currentUser) {
            router.replace("/dreams");
        }
    }, [loading, currentUser, router])

    if (loading) return (<div>...Loading</div>)
    
    
    async function handleLoginGuest() {
        try {
            await loginGuest()
            router.replace("/dreams")
        } catch (err){
            console.log(err)
        }
    }

    return (
        <div className="flex flex-col items-center mt-4">
            {/* HERO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full px-6 md:px-12 lg:px-24">
                <div className="flex justify-center md:order-1 order-2">
                    <Image 
                        src="/images/dream-card.png" 
                        alt="Dream card example" 
                        width={600}
                        height={600}
                        className="opacity-60 -rotate-6 hover:scale-105 transition w-[400px] md:w-[400px] lg:w-[600px]"
                    />
                </div>
                <div className="flex flex-col items-center md:order-2 order-1 md:items-start text-center md:text-left">
                    <h1 className="header-text flex items-center justify-center md:justify-start gap-2">
                        <Image src="/images/moon.png" alt="moon icon" width={100} height={100}/>
                        <span>Your Dreams, Organized</span>
                    </h1>
                    <p className="max-w-lg mb-4">
                        DreamNote is your personal dream journal. Record your dreams, organize by date and themes, and gain insights with AI-assisted analysis.
                    </p>
                    <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
                        <Button text="Get Started" onClick={() => router.replace('/auth/signup')} />
                        <span>or</span>
                        <Button text="Continue as Guest" onClick={handleLoginGuest} color="bg-gray-500 hover:bg-gray-700"/>
                    </div>
                </div>
            </div>
            {/* SECOND SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-12 px-6 md:px-12 lg:px-24">
                <div className="flex flex-col items-center md:items-end text-center md:text-right">
                    <h1 className="header-text flex items-center justify-center md:justify-end gap-2">
                        <span>AI Assisted Features</span>
                        <Image src="/images/ai.png" alt="book icon" width={80} height={80}/>
                    </h1>
                    <p className="max-w-md mb-4">
                        Optimize your dream tracking with AI generated themes, title suggestions and analysis.
                    </p>
                    <p>
                        Already have an account? 
                        <a href="/auth/login" className="text-blue-500 hover:underline ml-1">Login</a>
                    </p>
                </div>
                <div className="flex justify-center md:justify-end w-full">
                    <Image 
                        src="/images/analysis.png"
                        alt="Analysis example"
                        width={600}
                        height={600}
                        className="opacity-60 hover:scale-105 transition"
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-12 px-6 md:px-12 lg:px-24">
                {/* Image */}
                <div className="flex justify-center md:order-1 order-2">
                    <div className="flex flex mx-4">
                        <Image 
                            src="/images/themes.png"
                            alt="Organize dreams by date and theme"
                            width={200}
                            height={200}
                            className="opacity-60 hover:scale-105 transition"
                        />
                        <Image 
                            src="/images/dates.png"
                            alt="Organize dreams by date and theme"
                            width={200}
                            height={200}
                            className="opacity-60 hover:scale-105 transition"
                        />
                    </div>

                </div>
                {/* Text */}
                <div className="flex flex-col items-center md:order-2 order-1 md:items-start text-center md:text-left ml-4">
                    <h2 className="header-text flex items-center justify-center md:justify-start gap-2">
                        <Image src="/images/book.png" alt="book icon" width={100} height={100}/>
                        <span>Organise by Date & Theme</span>
                    </h2>
                    <p className="max-w-md mt-2 ml-4">
                        Quickly find patterns in your dreams by browsing chronologically or exploring recurring themes.
                    </p>
                </div>
            </div>
            <div className="flex items-center text-2xl gap-4 mt-12 text-purple-500 mb-10">
                <a href="https://www.linkedin.com/in/alex-small-a8977116b/" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon 
                        icon={faLinkedin}
                    />               
                </a>
                <a href="https://github.com/AlexSmall96/" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon
                        icon={faGithub}
                    />
                </a>
            </div>
        
        </div>
    )
}