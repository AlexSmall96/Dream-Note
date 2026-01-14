"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchFullDream, updateDream, DreamFullView } from "@/lib/api/dreams";
import DreamForm from "@/components/dreams/DreamForm";
import { DreamFormType } from '@/types/dreams'


export default function EditDreamPage({
  	params,
}: {
  	params: { id: string };
}) {
	
	const [dream, setDream] = useState<DreamFormType>({})

	// Get existing dream
	useEffect(() => {
		const getDream = async () => {
			const response = await fetchFullDream(params.id)
			setDream(response.dream)
		}
		getDream()
	}, [])

  	return (
		<DreamForm dream={dream} setDream={setDream} id={params.id} />
   );
}
