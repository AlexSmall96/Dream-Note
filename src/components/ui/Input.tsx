type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export function Input({ className = "", ...props }: InputProps) {
    return (
        <input
            className={`w-full px-3 py-2
                bg-slate-50
                border border-slate-300
                rounded-lg
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-400
                focus:border-indigo-400
                ${className}`}
            {...props}
        />
    )
}