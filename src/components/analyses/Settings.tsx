import IconWithTooltip from "../ui/IconWithTooltip"
import { faGear as faSettings } from "@fortawesome/free-solid-svg-icons";
import { useDreamView } from "@/contexts/DreamViewContext";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import SettingsRadioGroup from "./SettingsRadioGroup";

export default function Settings(){
    const { options, tone, setTone, style, setStyle, length, setLength } = useDreamView()
    return (
        <Popover className="relative">
            <PopoverButton className='focus:outline-none'>
            <IconWithTooltip
                icon={faSettings}
                tooltipText='Settings'
                extraClass="text-2xl text-gray-500"
            />
            </PopoverButton>
            <PopoverPanel anchor="bottom end" className="flex flex-col bg-white border p-4 rounded shadow text-sm">
            <SettingsRadioGroup setSetting={setTone} setting={tone} options={options.tone} settingName='Tone' />
            <SettingsRadioGroup setSetting={setStyle} setting={style} options={options.style} settingName='Style'/>
            <SettingsRadioGroup setSetting={setLength} setting={length} options={options.length} settingName='Length'/>
            </PopoverPanel>
            </Popover>
    )
}

