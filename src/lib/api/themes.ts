import { apiFetch } from "./client";
import { ThemeResponse } from "@/types/themes";

type ErrorMsg = {
    error: string
}

export async function removeTheme(id: string){
    return apiFetch<ThemeResponse | ErrorMsg>(`/themes/delete/${id}`, {method: 'DELETE'})
}