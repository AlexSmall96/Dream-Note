import { useDreamView } from "@/contexts/DreamViewContext"
import { faFeatherPointed as faEdit, faTrashCan as faDelete, faMagnifyingGlass as faAnalyse, faTags as faTheme } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "next/navigation"
import IconWithTooltip from '@/components/ui/IconWithTooltip';
import StickyNote from '@/components/dreams/StickyNote';
import DreamThemeList from '@/components/themes/DreamThemeList';

export default function DreamCard () {
    const { dream, setShowBlankLabel } = useDreamView()
    const params = useParams()
    const id = params.id as string

    return (
        <div className="relative mt-8 mb-8 p-8 pb-20 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg shadow-lg border border-purple-100 w-full max-w-xl h-110">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-lg text-gray-700 italic">
                    {new Date(dream.date).toLocaleDateString()}
                    </h2>
                    <h1 className="text-2xl font-serif text-gray-900 leading-relaxed">
                        {dream.title}
                    </h1>
                </div>
                <div className="flex gap-3">
                    <IconWithTooltip
                        href={`/dreams/${id}/analysis`}
                        icon={faAnalyse}
                        tooltipText="Analyse"
                        extraClass="hover:animate-pulse text-xl text-gray-500"
                    />
                    <IconWithTooltip
                        href={`/dreams/${id}/edit`}
                        icon={faEdit}
                        tooltipText="Edit"
                        extraClass="hover:animate-pulse text-xl text-gray-500"
                    />
                    <IconWithTooltip
                        href={`/dreams/${id}/delete`}
                        icon={faDelete}
                        tooltipText="Delete"
                        extraClass="hover:animate-pulse text-xl"
                        danger
                    />
                    <IconWithTooltip
                        icon={faTheme}
                        onClick={() => setShowBlankLabel(true)}
                        tooltipText="New Theme"
                        extraClass="hover:animate-pulse text-xl text-indigo-400"
                    />
                </div>
            </div>
            <p className="text-md text-gray-700 leading-relaxed font-light italic overflow-y-auto max-h-60 mb-4 pb-4 pr-5 text-justify">
                {dream.description}
            </p>
            <DreamThemeList />
            <StickyNote  />
        </div>
    )
}