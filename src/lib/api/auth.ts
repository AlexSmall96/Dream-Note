export async function signup(data: {
    email: string,
    password: string
}) {
    const response = await fetch('http://localhost:3000/api/users/signup', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
    })
    return response.json();
}