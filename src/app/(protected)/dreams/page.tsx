"use client";
import DreamsList from '@/components/dreams/DreamsList'
import { useRouter } from "next/navigation";

export default function Dreams() {
    const router = useRouter();
      return (
        <div className="flex flex-col items-center">
          <h1 className="text-l font-bold m-4">Dreams</h1>
          <button onClick={() => router.replace("/dreams/create")} className='bg-blue-500 hover:bg-blue-700 text-white font-bold p-2'>Log New Dream</button>
        </div>
      );
}