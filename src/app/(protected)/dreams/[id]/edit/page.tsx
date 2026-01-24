"use client";

import { useEffect, useState } from "react";
import { fetchFullDream  } from "@/lib/api/dreams";
import DreamForm from "@/components/dreams/DreamForm";
import { DreamFormType } from '@/types/dreams'
import { useRouter } from "next/navigation"
import { useDreamSubmit } from "@/app/hooks/useDreamSubmit";

export default function EditDreamPage({
  	params,
}: {
  	params: { id: string };
}) {
	
	const [dream, setDream] = useState<DreamFormType>({title: '', description: '', notes: '', date: ''})
	const [themes, setThemes] = useState<string[]>([])
	const { submitDream, msg, setMsg } = useDreamSubmit()
	const router = useRouter()

	// Get existing dream
	useEffect(() => {
		const getDream = async () => {
			const response = await fetchFullDream(params.id)
			const { title, description, notes, date } = response.dream
			setDream({ title, description: description || '', notes: notes || '', date: date.toISOString().split('T')[0]})
			setThemes(response.themes?.map(theme => theme.theme)?? [])
		} 
		getDream()
	}, [])

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault()
		await submitDream({
			id: params.id,
			title: dream.title,
			description: dream.description,
			notes: dream.notes,
			date: new Date(dream.date),
			themes: themes
		})		
	}

  	return (
		<div className="flex flex-col items-center m-4">
			<DreamForm 
				dream={dream} 
				setDream={setDream}
				themes={themes}
				setThemes={setThemes}
				handleSubmit={handleSubmit}
				msg={msg}
				setMsg={setMsg}
				handleGoBack={() => {router.replace(`/dreams/${params.id}`)}}
				backText="Back to Dream"
			/>
		</div>
   );
}
