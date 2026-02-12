import LandingPage from '@/components/LandingPage';
import { getCurrentUser } from '@/lib/api/auth';
import React from 'react';
import { redirect } from "next/navigation"

export default async function Home() {
	const result = await getCurrentUser()

	if (!('errors' in result)){
		redirect('/dreams')
	}

  	return (
		<div className="flex flex-col items-center m-4">
			<h1>Home page</h1>  
			<LandingPage />
		</div>
  	);
}
