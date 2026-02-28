import { apiFetch } from "@/lib/api/client";
import { ThemeListWithCounts } from "@/types/themes";

export async function fetchThemes (){
    return apiFetch<ThemeListWithCounts>('/themes')
}

export async function fetchThemeSuggestions (search: string) {
    return apiFetch<string[]>(`/themes/suggestions?search=${search}`)
}   