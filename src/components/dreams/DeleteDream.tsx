import { useRouter } from "next/navigation";
import Button from "../forms/Button";


export default function DeleteDream ({
    msg, deleted, visible, handleDelete, backUrl, waiting
}:{
    msg: string, deleted: boolean, visible: boolean, handleDelete: () => Promise<void>, backUrl:string, waiting: boolean
}) {
    const router = useRouter()

    return (
        <div className="flex flex-col items-center mt-4">
            <h1 className="text-xl font-semibold mb-4 text-center px-2">{msg}</h1>
            <div className="flex gap-2">
            <Button 
                onClick={() => router.replace(backUrl)} 
                extraClass='bg-gray-500 p-2'
                text={deleted? 'Back to Dashboard': 'Go back'}
            />
            {visible && <Button onClick={handleDelete} extraClass='bg-red-500 p-2' text="Yes" disabled={waiting} />}
            </div>
        </div>
    )
}