"use client";

import { useEffect, useState } from "react";
import { fetchFullDream, updateDream } from "@/lib/api/dreams";
import DreamForm from "@/components/dreams/DreamForm";
import { DreamFormType } from '@/types/dreams'
import { useDreams } from "@/contexts/DreamsContext";
export default function EditDreamPage({
  	params,
}: {
  	params: { id: string };
}) {
	
	const [dream, setDream] = useState<DreamFormType>({})
	const [msg, setMsg] = useState<string>('')
	const { setDreams } = useDreams()

	// Get existing dream
	useEffect(() => {
		const getDream = async () => {
			const response = await fetchFullDream(params.id)
			setDream(response.dream)
		}
		getDream()
	}, [])

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault()
		const result = await updateDream(params.id, {dream, themes: []}) 
		if ('error' in result){
			return setMsg(result.error)
		}
		const dreamOverview = {title: result.dream.title, date: result.dream.date, _id: result.dream._id}
		setDreams(prev => [dreamOverview, ... prev])
		setMsg('Dream logged')
	}

  	return (
		<div className="flex flex-col items-center m-4">
			<DreamForm 
				dream={dream} 
				setDream={setDream}
				handleSubmit={handleSubmit}
				msg={msg}
				setMsg={setMsg}
			/>
		</div>
   );
}
