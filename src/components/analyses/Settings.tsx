import { faGear as faSettings } from "@fortawesome/free-solid-svg-icons";
import { useDreamView } from "@/contexts/DreamViewContext";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import SettingsRadioGroup from "./SettingsRadioGroup";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { useScreenSize } from "@/app/hooks/useScreenSize";

export default function Settings(){
    const { options, tone, setTone, style, setStyle, length, setLength } = useDreamView()
    const {isMedium} = useScreenSize()

    return (
        <Popover className="relative">
            <PopoverButton className='focus:outline-none'>
                        <div className="font-sans relative group inline-block">
                            <FontAwesomeIcon 
                                className='hover:animate-pulse text-gray-500'
                                icon={faSettings} 
                            />
                            {!isMedium && <span 
                                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                                    opacity-0 group-hover:opacity-100 transition
                                    bg-yellow-200 text-gray-800 text-xs px-2 py-1 shadow rotate-1 whitespace-nowrap select-none cursor-default"
                            >
                                Settings
                            </span>}
                        </div>
            </PopoverButton>
            <PopoverPanel anchor="bottom end" className="flex flex-col bg-white border p-4 rounded shadow text-sm">
                <SettingsRadioGroup setSetting={setTone} setting={tone} options={options.tone} settingName='Tone' />
                <SettingsRadioGroup setSetting={setStyle} setting={style} options={options.style} settingName='Style'/>
                <SettingsRadioGroup setSetting={setLength} setting={length} options={options.length} settingName='Length'/>
            </PopoverPanel>
            </Popover>
    )
}

