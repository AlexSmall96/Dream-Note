import { useDreamView } from "@/contexts/DreamViewContext"
import LinkWithMessage from "../forms/LinkWithMessage";
import { faFeatherPointed as faEdit } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan as faDelete } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "next/navigation"
import { faMagnifyingGlass as faAnalyse } from "@fortawesome/free-solid-svg-icons";
import IconWithTooltip from "../ui/IconWithTooltip";

export default function DreamCard () {
    const {dream, themes } = useDreamView()
    const params = useParams()
    const id = params.id as string

    return (
        <div className="relative mt-8 mb-16 p-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg shadow-lg border border-purple-100 w-full max-w-xl">
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
                        extraClass="text-xl text-gray-500"
                    />
                    <IconWithTooltip
                        href={`/dreams/${id}/edit`}
                        icon={faEdit}
                        tooltipText="Edit"
                        extraClass="text-xl text-gray-500"
                    />
                    <IconWithTooltip
                        href={`/dreams/${id}/delete`}
                        icon={faDelete}
                        tooltipText="Delete"
                        extraClass="text-xl"
                        danger
                    />
                </div>
            </div>
            <p className="text-md text-gray-700 leading-relaxed font-light italic">
                {dream.description}
            </p>
            <div className="flex flex-wrap gap-2 m-2">
                {themes.map(theme => (
                    <span
                        key={theme.theme}
                        className="bg-brand-softer border border-brand-subtle bg-gray-300 text-fg-brand-strong text-sm font-medium px-2 py-1 rounded"
                    >
                    {theme.theme}
                    </span>
                ))}
            </div>

            {dream.notes &&
              <div className="absolute -bottom-6 right-6 rotate-2 bg-yellow-200 p-3 shadow-lg rounded-sm w-48">
                <p className="text-sm text-gray-800">{dream.notes}</p>
            </div>}
        </div>
    )
}