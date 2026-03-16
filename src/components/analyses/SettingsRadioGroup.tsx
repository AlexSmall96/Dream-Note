import { setterFunction } from "@/types/setterFunctions"
import { Popover, PopoverButton, PopoverPanel, Field, RadioGroup, Radio, Label } from "@headlessui/react";


export default function SettingsRadioGroup({
    setting, setSetting, options
}:{
    setting: string,
    setSetting: setterFunction<string>,
    options: string[]
}){
    return (
        <>
            Tone:
            <RadioGroup aria-label="Server size" value={setting} onChange={setSetting}>
            {options.map((option, index) => (
                <Field key={index} className="flex items-center gap-2">
                <Radio
                    value={option}
                    className="group flex size-5 items-center justify-center rounded-full border bg-white data-[checked]:bg-blue-500 data-[checked]:border-blue-500"
                >
                    <span className="invisible size-2 rounded-full bg-white group-data-[checked]:visible" />
                </Radio>
                <Label>{option}</Label>
                </Field>
            ))}
            </RadioGroup>        
        </>

    )
}