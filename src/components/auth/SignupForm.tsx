"use client";

import { useState } from "react";
import { signup } from "@/lib/api/auth";
import { useRouter } from "next/navigation";

export default function SignupForm() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [errors, setErrors] = useState({password: '', email: ''});

    const getError = (array: {value: string, msg: string, param: string}[], param: string) => {
        const errorObj = array.filter((
            err: {value: string, msg: string, param: string}
        ) => {
            return err.param === param
        })
        
        return errorObj[0]?.msg ?? ''
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (password1 !== password2){
            return setErrors({password: 'Password and confirm password must match.', email: errors.email})
        } 
        const result = await signup({ email, password: password1 });
        if ('errors' in result){
            const emailError = getError(result.errors, 'email')
            const pwdError = getError(result.errors, 'password')
            
            return setErrors({email: emailError, password: pwdError})
        }   
        router.push("/");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-80">
        <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
        />
        {errors.email?? ''}
        <input
            type="password"
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
            placeholder="Password"
        />
        <input
            type="password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            placeholder="Confirm Password"
        />
        {errors.password?? ''}
      <button type="submit" className='bg-blue-500 hover:bg-blue-700 text-white font-bold'>Sign up</button>
    </form>
  );
}