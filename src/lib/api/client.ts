const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  	throw new Error("PUBLIC_API_URL is not defined");
}

export async function apiFetch<ResponseType, BodyType=undefined> (
	path: string, 
	options?:{
		method?: string;
		body?: BodyType;
	}
):Promise<ResponseType>{
	const { method = "GET", body } = options || {}

	const response = await fetch(`${API_URL}${path}`, {
		method,
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
		...(body ? { body: JSON.stringify(body) } : {})
    })
    return response.json();
}
