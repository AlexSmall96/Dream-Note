import { Card } from "@/components/ui/Card";

export default function DescriptionSnapshot({description}: {description: string}) {
    return (
        <Card className="bg-paper max-h-[40vh] overflow-y-auto scrollbar-custom">
            <p className='font-semibold mt-2'>Description used:</p>
            <p className="mt-1 text-lg font-caveat">{description}</p>
        </Card>
    )
}