import { apiFetch } from "@/lib/api/client";
import { ThemeList } from "@/types/themes";

export async function fetchThemes (){
    return apiFetch<ThemeList>('/themes')
}