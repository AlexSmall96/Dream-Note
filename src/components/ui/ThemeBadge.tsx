import { MouseEventHandler } from "react"

export function ThemeBadge({
    currentTheme, handleClick
}:{
    currentTheme:string, 
    handleClick: 
    MouseEventHandler<HTMLButtonElement>
}){

    return(
        <span id="badge-dismiss-brand" 
            className="inline-flex items-center bg-brand-softer border border-brand-subtle text-fg-brand-strong text-xs font-medium ps-1.5 pe-0.5 py-0.5 rounded gap-1">
            {currentTheme}
            <button type="button" onClick={handleClick} className="inline-flex items-center p-0.5 text-sm bg-transparent rounded-xs hover:bg-neutral-tertiary" data-dismiss-target="#badge-dismiss-alternative" aria-label="Remove">
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6"/></svg>
            </button>                    
        </span>
    )
}