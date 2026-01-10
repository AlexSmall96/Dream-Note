'use client';
import DreamsList from '@/components/dreams/DreamsList'
import { useRouter } from "next/navigation";

export default function DreamsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <div className="flex h-screen">
      <aside className="w-64 border-r">
        <button onClick={() => router.replace("/dreams/create")} className='bg-blue-500 hover:bg-blue-700 text-white font-bold p-2'>Log New Dream</button>
        <DreamsList />
      </aside>

      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}

