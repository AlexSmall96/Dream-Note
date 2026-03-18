import { setterFunction } from '@/types/setterFunctions'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

export default function Dropdown<parameterType extends string>({
    parameter, setParameter, options, placeholder
}:{
    parameter: parameterType,
    setParameter: setterFunction<parameterType>,
    options: parameterType[],
    placeholder: string
}) {

    return (
        <Menu as="div" className="relative inline-block">
            <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-gray-100 hover:bg-gray-200 px-2 py-0.5 text-sm shadow-xs inset-ring-1 inset-ring-gray-300 ">
                {parameter ? parameter.split(' ')[0] : placeholder}
                <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
            </MenuButton>
            <MenuItems
                transition
                className="absolute z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg outline-1 outline-black/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
            >
                <div className="py-1">
                    {options.map(option => 
                        <MenuItem key={option}>
                            <button
                                onClick={() => {setParameter(option)}}
                                className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                            >
                                {option}
                            </button>
                        </MenuItem>
                    )}
                </div>
            </MenuItems>
        </Menu>
    )
}
