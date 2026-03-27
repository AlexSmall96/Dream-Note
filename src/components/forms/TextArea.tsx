type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

export function TextArea({ className = "", ...props }: TextAreaProps) {
    return (
        <textarea
            className={`w-full px-3 py-2
                bg-slate-50
                border border-slate-300
                rounded-lg
                focus:outline-none
                focus:ring-2
                focus:ring-purple-400
                focus:border-purple-400
                ${className}`}
            {...props}
        />
    )
}