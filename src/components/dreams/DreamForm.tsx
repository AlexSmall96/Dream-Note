import { Dispatch, SetStateAction } from 'react'
import { DreamFormType } from "@/types/dreams";

export default function DreamForm({ 
    dream, setDream, handleSubmit, msg, setMsg
}:{ 
    dream: DreamFormType, 
    setDream: Dispatch<SetStateAction<DreamFormType>>, 
    handleSubmit: (event:React.FormEvent) => Promise<any>,
    msg: string,
    setMsg: Dispatch<SetStateAction<string>>
}){ 

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMsg('')
        setDream({
            ...dream, [event.target.name ]: event.target.value
        })    
    }

    return (
        <form className="flex flex-col gap-2 w-80">
            <input 
                type='text'
                value={dream.title}
                name='title'
                onChange={handleChange}
                placeholder="Title"
            />
            <input 
                type='text'
                value={dream.description}
                name='description'
                onChange={handleChange}
                placeholder="Description"
            />
            <input 
                type='text'
                value={dream.notes}
                name='notes'
                onChange={handleChange}
                placeholder="Notes"
            />
            {msg ?? ''}
            <button 
                type='submit' 
                onClick={handleSubmit}
                className='bg-blue-500' 
            >
                Save
            </button>
        </form>
    )
}