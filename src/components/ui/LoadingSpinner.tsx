export default function LoadingSpinner() {
    return (
        <div className="flex justify-center items-center py-10">
            <div className="w-6 h-6 border-2 border-purple-200 border-t-purple-500 rounded-full animate-spin" />
        </div>
    )
}