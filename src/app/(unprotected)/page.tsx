import LandingPage from '@/components/home/LandingPage';
import React from 'react';

export default  function Home() {

  	return (
		<div className="flex flex-col items-center m-4">
			<h1>Home page</h1>  
			<LandingPage />
		</div>
  	);
}
