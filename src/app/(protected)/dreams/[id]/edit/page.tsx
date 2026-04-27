"use client";

import { useEffect, useState } from "react";
import DreamForm from "@/components/dreams/DreamForm";
import { DreamFormType } from '@/types/dreams'
import { useUpdateDream } from "@/app/hooks/useUpdateDream";
import { fetchFullDream } from "@/lib/api/dreams";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useRouter } from "next/navigation";
import { faFeatherPointed as faLog} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function EditDreamPage({
  	params,
}: {
  	params: { id: string };
}) {
	
	const [dreamFormData, setDreamFormData] = useState<DreamFormType>({title: '', description: '', notes: '', date: ''})
	const { updateDream, msg, setMsg } = useUpdateDream()
	const [themes, setThemes] = useState<string[]>([])
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const router = useRouter()

	// Get existing dream
	useEffect(() => {
		const getFullDream = async () => {
			setLoading(true)
			try {
				const response = await fetchFullDream(params.id)
				const { title, description, notes, date } = response.dream
				setDreamFormData({ title, description: description || '', notes: notes || '', date: date.toISOString().split('T')[0]})
				setThemes(response.themes?.map(t => t.theme) || [])
				setLoading(false)
			} catch (err){
				console.log(err)
			} finally {
				setLoading(false)
			}
		}
		getFullDream()
	}, [params.id])

	if (saving) {
		return (
			<div className="header-content mt-12 flex flex-col items-center">
				<FontAwesomeIcon icon={faLog}/> Saving your dream...
			</div>
		)
	}

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault()
		try {
			setSaving(true)
			await updateDream(dreamFormData, themes, params.id)
			router.replace(`/dreams/${params.id}`)
		} catch (err) {
			setMsg('Something went wrong')
			setSaving(false)
		}
	}

  	return (
		<div className="flex flex-col items-center">
            <h1 className="header-content">Edit Dream</h1>
			{loading ? 
				<LoadingSpinner /> 
			:
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
			}
		</div>
   );
}
