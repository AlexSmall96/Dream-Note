import { ThemeResponse } from "@/types/themes";

export default function DreamThemeList ({themes}:{themes:string[]}) {
    return (
        <div className="flex flex-wrap gap-2 m-2">
            {themes.map(theme => (
                <span
                    key={theme}
                    className="bg-brand-softer border border-brand-subtle bg-gray-300 text-fg-brand-strong text-sm font-medium px-2 py-1 rounded"
                >
                {theme}
                </span>
            ))}
        </div>
    )
}