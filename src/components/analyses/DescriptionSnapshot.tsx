import { Card } from "@/components/ui/Card";
import { useAnalysesContext } from "@/contexts/AnalysesContext";

export default function DescriptionSnapshot() {
    const { description } = useAnalysesContext();
    return (
        <Card className="bg-paper max-h-[40vh] overflow-y-auto scrollbar-custom-gray text-justify">
            <p className='font-semibold mt-2'>Description used:</p>
            <p className="mt-1 text-lg font-caveat">{description}</p>
        </Card>
    )
}