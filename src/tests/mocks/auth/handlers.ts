import baseUrl from "@/tests/utils/setUrl";
import { http, HttpResponse } from "msw";

type SignupRequestBody = {
    email: string;
    password: string;
}

const userOneCreds = {
    email: 'user1@email.com',
    password: 'apple123'
}

const url = baseUrl + '/users'

export const authHandlers = [

    http.post(`${url}/signup`, async ({request}) => {
        // Mock valid and invalid sign up data
        const { email, password } = (await request.json()) as SignupRequestBody
        const errors: {param: string, msg: string, value: string}[] = []
        if (email === userOneCreds.email){
            errors.push(
                {param: 'email', msg: 'Email address already in use.', value: email}
            )
        }

        if (password.includes('password')) {
            errors.push(
                {param: 'password', msg: 'Password cannot contain "password".', value: password}
            )            
        }
        // Errors may also be 'password must be at least 8 characters' or 'please provide a vaid email address'.
        // However, this is unecessary to include as the frontend functionality is agnostic of the specific error message.
        if (errors.length){
            return HttpResponse.json({errors}, {status: 400})
        }
        return HttpResponse.json({
            user: {email, password}, message: 'Signup successful. Please check your emails for verification instructions.'
        }, {status: 201})
    })

]
