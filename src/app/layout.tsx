import type { Metadata } from "next";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "./globals.css";
import Navbar from "@/components/nav/Navbar";
import RootClientWrapper from "./RootClientWrapper";

export const metadata: Metadata = {
	title: "Dream Note",
  	description: "Dream journal App with AI analysis built with nextJS.",
};

config.autoAddCss = false

export default function RootLayout({
  	children,
}: Readonly<{
  	children: React.ReactNode;
}>) {

  return (
    <html lang="en">
		<head>
			<link
			rel="preconnect"
			href="https://fonts.googleapis.com"
			/>
			<link
			rel="preconnect"
			href="https://fonts.gstatic.com"
			crossOrigin=""
			/>
			<link href="https://fonts.googleapis.com/css2?family=Playwrite+AU+VIC:wght@400&display=swap" rel="stylesheet" />		
			<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&display=swap" rel="stylesheet"></link>	
		</head>
		<body className='bg-violet-100 font-sans'>
			<RootClientWrapper>
				<Navbar />
				{children}
			</RootClientWrapper>
		</body>
    </html>
  );
}
