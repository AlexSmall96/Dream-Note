"use client";

import { useEffect, useState } from "react";
import DreamForm from "@/components/dreams/DreamForm";
import { DreamFormType } from '@/types/dreams'
import { useUpdateDream } from "@/app/hooks/useUpdateDream";
import { useDreamView } from "@/contexts/DreamViewContext";

export default function EditDreamPage({
  	params,
}: {
  	params: { id: string };
}) {
	
	const [dreamFormData, setDreamFormData] = useState<DreamFormType>({title: '', description: '', notes: '', date: ''})
	const { updateDream, msg, setMsg } = useUpdateDream()
	const { dream, themes, setThemes} = useDreamView()
	
	// Get existing dream
	useEffect(() => {
		if (!dream || !dream.date) return
		const { title, description, notes, date } = dream
		setDreamFormData({ title, description: description || '', notes: notes || '', date: date.toISOString().split('T')[0]})
	}, [dream])
	
	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault()
		await updateDream(dreamFormData, themes, params.id)
	}

  	return (
		<div className="flex flex-col items-center m-4">
			<DreamForm 
				dream={dreamFormData} 
				setDream={setDreamFormData}
				themes={themes}
				setThemes={setThemes}
				handleSubmit={handleSubmit}
				msg={msg}
				setMsg={setMsg}
				backHref={`/dreams/${params.id}`}
				backText="Back to Dream"
			/>
		</div>
   );
}
