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

export async function login(data:{
    email: string,
    password: string    
}){
    const response = await fetch('http://localhost:3000/api/users/login', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),        
    })
    return response.json();
}


export async function getCurrentUser() {
    const res = await fetch("http://localhost:3000/api/users/auth/me", {
        credentials: "include",
    })
    if (!res.ok) return null;
    console.log(res)
    return res.json()
}
