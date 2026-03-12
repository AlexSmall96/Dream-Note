import { useDreamView } from "@/contexts/DreamViewContext"
import { fetchAnalysis, saveNewAnalysis } from "@/lib/api/aiAnalysis"

export function useDreamAnalysis(id: string) {

    const { dream, analysis, setAnalysis, tone, style, length } = useDreamView()

    const getAnalysis = async () => {
        if (!dream.description) return

        const response = await fetchAnalysis({
        description: dream.description,
        params: { tone, style, length }
        })

        setAnalysis(response.analysis)
    }

    const saveAnalysis = async () => {
        if (!analysis) return
        await saveNewAnalysis(id, { text: analysis, tone, style, length })
    }

    return { getAnalysis, saveAnalysis }
}