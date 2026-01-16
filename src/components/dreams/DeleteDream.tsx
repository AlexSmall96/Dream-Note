import { useRouter } from "next/navigation";


export default function DeleteDream ({
    msg, deleted, visible, handleDelete, backUrl, waiting
}:{
    msg: string, deleted: boolean, visible: boolean, handleDelete: () => Promise<void>, backUrl:string, waiting: boolean
}) {
    const router = useRouter()

    return (
        <div className="flex flex-col items-center">
            <h1>{msg}</h1>
            <button 
                onClick={() => router.replace(backUrl)} 
                className='bg-gray-500 p-2'
            >
                {deleted? 'Back to all dreams': 'Go back'}
            </button>
            
            {visible && <button onClick={handleDelete} className='bg-red-500 p-2' disabled={waiting}>Yes</button>}
        </div>
    )
}