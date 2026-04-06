import { useCurrentUser } from "@/contexts/CurrentUserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons";
import { 
    faFeatherPointed as faLog, 
    faChartBar as faDashboard, 
    faUser as faAccount, 
    faUserPlus as faSignup, 
    faRightToBracket as faLogin  
} from "@fortawesome/free-solid-svg-icons";
import SearchBar from "./SearchBar";
import Dropdown from "../ui/Dropdown";
import { MONTH_KEYS } from "@/lib/filters/dateRanges"
import { useDreamCounts } from "@/contexts/DreamCountsContext";
import { useThemesAside } from "@/contexts/ThemesAsideContext";
import DreamsList from "./DreamsList";
import ThemesList from "./ThemesList";
import { getColorForTheme } from "@/lib/utils/getColorForTheme";
import LogoutButton from "@/components/nav/LogoutButton"
import ViewToggle from "./ViewToggle";
import LinkWithIcon from "../ui/LinkWithIcon";

export default function OffCanvas() {

    const { selectedTheme, setSelectedTheme, view, year, setYear, monthString, setMonthString, isOpen, setIsOpen } = useThemesAside()
    const { stats } = useDreamCounts()
    const monthlyTotals = stats.monthlyTotals
    const uniqueYears = stats.uniqueYears

    const monthOptions: string[] = []

    MONTH_KEYS.forEach(m => {
        if (monthlyTotals[m]){
            monthOptions.push(m + ` (${monthlyTotals[m]})`)
        }
    })

    const { currentUser, loading } = useCurrentUser()

    return (
        <div className={`fixed inset-0 z-50 ${isOpen ? "" : "pointer-events-none"}`}>
            <div className={`absolute inset-0 bg-black/50 transition-opacity duration-300 
                            ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={() => setIsOpen(false)}
            />
            <div
                className={`
                    absolute right-0 top-0 h-full w-[80%] max-w-sm bg-white p-4 shadow-lg overflow-y-auto transform transition-transform duration-300 ease-in-out 
                    ${isOpen ? "translate-x-0" : "translate-x-full"}
                `}
            >
                <button onClick={() => setIsOpen(false)} className="mb-4 text-xl">
                    ✕
                </button>
                
                <div className="flex flex-col gap-3">
                    {loading ? null : currentUser ? 
                        <>  
                            <div className="flex justify-center-safe items-center gap-2">
                                <FontAwesomeIcon icon={faCircleUser} className='text-gray-500 text-3xl' />
                                <span>{currentUser?.email}</span>
                                {currentUser?.isVerified && <><span className="text-xs text-gray-500 mt-1"> Verified </span> <span className='text-green-500'>✓</span></>}
                            </div>
                            
                        <button onClick={() => window.location.href = '/dreams/create'} className="bg-purple-500 text-white px-3 py-1.5 rounded hover:bg-purple-600 transition-colors text-sm">
                            <FontAwesomeIcon icon={faLog} className="mr-1" /> Log Dream
                        </button>  

                            {uniqueYears.length > 0 && <SearchBar />}

                            <LinkWithIcon href='/dreams' icon={faDashboard} text='Dashboard' />
                        
                            <LinkWithIcon href='/account' icon={faAccount} text='Account' />
                            <hr className="border-t border-gray-300" />
                            {uniqueYears.length > 0 ? 
                                <>
                                    <ViewToggle />
                                    {selectedTheme && view === 'themes' &&
                                        <div className="flex items-center gap-2">
                                            <button className='mr-1' onClick={() => setSelectedTheme('')}>
                                                ←
                                            </button>
                                            <span className={`${getColorForTheme(selectedTheme, true)} text-sm w-auto px-2 py-1 shadow-sm border-l-2 border-black/20`}>{selectedTheme}</span>
                                        </div>}
                                    {view === 'dreams' &&
                                    <div className="flex items-center gap-2">
                                        <Dropdown<string> parameter={year} setParameter={setYear} options={uniqueYears} placeholder={'Select Year'} />
                                        <Dropdown<string> parameter={monthString} setParameter={setMonthString} options={monthOptions} placeholder={'Month'} />
                                    </div>
                                    }
                                    {view === 'themes' && !selectedTheme && <ThemesList />}
                                    {(view === 'themes' && selectedTheme) || (view === 'dreams' && monthString) ? 
                                        <DreamsList /> 
                                    : 
                                        <span className='text-gray-500 text-sm'>{view === 'themes' ? 'Select a theme to view dreams.' : 'Select a month to view dreams.'}</span>
                                    }                               
                                </> 
                            : 
                                <p className="text-sm">Your dreams will appear here. Click the button above to log your first dream.</p>
                            }
                            <hr className="border-t border-gray-300" />
                            <LogoutButton />
                        </>
                    : 
                        <>
                            <LinkWithIcon href="/auth/login" icon={faLogin} text="Login" />
                            <LinkWithIcon href="/auth/signup" icon={faSignup} text="Signup" />
                        </>}
                </div>
            </div>
        </div>
    )
}
