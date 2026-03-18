import type { Metadata } from "next";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "./globals.css";
import RootClientWrapper from "./RootClientWrapper";

export const metadata: Metadata = {
	title: "Dream Note",
  	description: "An AI-assisted Dream journal App built with nextJS and Express.",
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
			<link rel="preconnect" href="https://fonts.googleapis.com" />
			<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
			<link  
				href="https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&family=Playwrite+AU+VIC:wght@100..400&family=Quicksand:wght@300..700&display=swap" 
				rel="stylesheet" 
			/>
		</head>
		<body className='bg-violet-100 font-quicksand'>
			<RootClientWrapper>
				{children}
			</RootClientWrapper>
		</body>
    </html>
  );
}
