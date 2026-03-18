import { setterFunction } from "@/types/setterFunctions";
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
import { MONTH_KEYS, MonthLabel } from "@/lib/filters/dateRanges"
import { useEffect, useState } from "react";
import { useDreamCounts } from "@/contexts/DreamCountsContext";
import { useThemesAside } from "@/contexts/ThemesAsideContext";
import DreamsList from "./DreamsList";
import ThemesList from "./ThemesList";
import { getColorForTheme } from "@/lib/utils/getColorForTheme";
import YearSelect from "@/components/nav/YearSelect";
import LogoutButton from "@/components/nav/LogoutButton"
import ViewToggle from "./ViewToggle";
import LinkWithIcon from "../ui/LinkWithIcon";

export default function OffCanvas({ setIsOpen }: { setIsOpen: setterFunction<boolean> }) {

    const [monthString, setMonthString] = useState('')

    useEffect(() => {
        const month = monthString.split(' ')[0] as MonthLabel
        setMonth(month)
    }, [monthString])
    
    const { selectedTheme, setSelectedTheme, view, setMonth } = useThemesAside()

    const { stats } = useDreamCounts()
    const monthlyTotals = stats.monthlyTotals
    const options: string[] = []

    MONTH_KEYS.forEach(m => {
        if (monthlyTotals[m]){
            options.push(m + ` (${monthlyTotals[m]})`)
        }
    })


    const { currentUser, loading } = useCurrentUser()
    return (
    			<div className="fixed inset-0 z-50">
				
				<div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />

				<div className="absolute right-0 top-0 h-full w-[80%] max-w-sm bg-white p-4 shadow-lg overflow-y-auto">
					
					<button onClick={() => setIsOpen(false)} className="mb-4 text-xl">
						✕
					</button>
					<div className="flex flex-col gap-4">
						{loading ? null : currentUser ? 
                            <>  
                                <div className="flex justify-center-safe items-center gap-2">
                                    <FontAwesomeIcon icon={faCircleUser} className='text-gray-500 text-3xl' />
                                    <span>{currentUser?.email}</span>
                                    {currentUser?.isVerified && <><span className="text-xs mt-1"> Verified </span> <span className='text-green-500'>✓</span></>}
                                </div>
                                
                                <LinkWithIcon href="/dreams/create" icon={faLog} text="Log Dream" />    

                                <SearchBar />

                                <LinkWithIcon href='/dreams' icon={faDashboard} text='Dashboard' />
                            
                                <LinkWithIcon href='/account' icon={faAccount} text='Account' />

                                <ViewToggle />

                                {selectedTheme && 
                                <span className="flex items-center gap-1">
                                    <span className={`font-caveat ${getColorForTheme(selectedTheme)} px-3 py-1 shadow-md border-l-4 border-black/20`}>{selectedTheme}</span>
                                    <button className='bg-gray-500 hover:bg-blue-700 text-white font-bold px-3 py-1 w-full' onClick={() => setSelectedTheme('')}>
                                        Back to all themes
                                    </button>
                                </span>}
                                {view === 'dreams' &&
                                <div className="flex items-center gap-2">
                                    <YearSelect />
                                    <Dropdown<string> parameter={monthString} setParameter={setMonthString} options={options} parameterName="Month" />
                                </div>
                                }
                                {view === 'themes' && !selectedTheme && <ThemesList />}
                                {(view === 'themes' && selectedTheme) || (view === 'dreams' && monthString) ? 
                                <DreamsList /> : null}

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

