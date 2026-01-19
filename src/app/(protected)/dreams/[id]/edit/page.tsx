"use client";

import { useEffect, useState } from "react";
import { fetchFullDream, updateDream } from "@/lib/api/dreams";
import DreamForm from "@/components/dreams/DreamForm";
import { DreamFormType } from '@/types/dreams'
import { useDreams } from "@/contexts/DreamsContext";
import { ThemeResponse } from "@/types/themes";
import { removeTheme } from "@/lib/api/themes";

export default function EditDreamPage({
  	params,
}: {
  	params: { id: string };
}) {
	
	const [dream, setDream] = useState<DreamFormType>({title: '', description: '', notes: '', date: ''})
	const [themes, setThemes] = useState<string[]>([])
	const [msg, setMsg] = useState<string>('')
	const { setDreams } = useDreams()

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
		const payload = {
			dream: {
				title: dream.title,
				description: dream.description.trim() || null,
				notes: dream.notes.trim() || null,
				date: new Date(dream.date)
			},
			themes: dream.description ? themes : []
		}
		const result = await updateDream(params.id, payload) 
		if ('error' in result){
			return setMsg(result.error)
		}
		// Update dreams list sidebar
		const dreamOverview = {title: result.dream.title, date: result.dream.date, _id: result.dream._id}
		setDreams(prev => [dreamOverview, ... prev.filter(dream => dream._id !==dreamOverview._id)])
		setMsg('Dream updated')
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
			/>
		</div>
   );
}
