import IconWithTooltip from "../ui/IconWithTooltip"
import { faGear as faSettings } from "@fortawesome/free-solid-svg-icons";
import Dropdown from "@/components/ui/Dropdown";
import { useDreamView } from "@/contexts/DreamViewContext";
import { useState } from "react";

export default function Settings(){
    const { options, tone, setTone, style, setStyle, length, setLength } = useDreamView()
    const [showSettings, setShowSettings] = useState(false)
    return (
        <>
            <IconWithTooltip
                onClick={() => setShowSettings(prev => !prev)} 
                icon={faSettings}
                tooltipText={`${!showSettings? 'Show': 'Hide'} settings`}
                extraClass="mx-2 text-xl text-gray-500"
            />
            {showSettings &&
                <>
                    <Dropdown<string> parameter={tone} setParameter={setTone} options={options.tone} parameterName="tone"/>
                    <Dropdown<string> parameter={style} setParameter={setStyle} options={options.style} parameterName="style" />                        
                    <Dropdown<string> parameter={length} setParameter={setLength} options={options.length} parameterName="length" />                        
                </>
            }    
        </>

    )
}

