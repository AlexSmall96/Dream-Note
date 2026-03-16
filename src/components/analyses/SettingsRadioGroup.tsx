import { setterFunction } from "@/types/setterFunctions"
import { Field, RadioGroup, Radio, Label } from "@headlessui/react";


export default function SettingsRadioGroup({
    settingName, setting, setSetting, options
}:{
    settingName: string
    setting: string,
    setSetting: setterFunction<string>,
    options: string[]
}){
    return (
        <>
            <span className="font-bold">{settingName}:</span>
            <RadioGroup aria-label="Server size" value={setting} onChange={setSetting} className='mb-2'>
            {options.map((option, index) => (
                <Field key={index} className="flex items-center gap-2">
                <Radio
                    value={option}
                    className="group flex size-3 items-center justify-center rounded-full border bg-white data-[checked]:bg-blue-500 data-[checked]:border-blue-500"
                >
                    <span className="invisible size-1 rounded-full bg-white group-data-[checked]:visible" />
                </Radio>
                <Label>{option}</Label>
                </Field>
            ))}
            </RadioGroup>        
        </>

    )
}