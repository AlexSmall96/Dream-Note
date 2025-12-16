import type { Metadata } from "next";
import Link from 'next/link';

import "./globals.css";
import Navbar from "@/components/nav/Navbar";

export const metadata: Metadata = {
	title: "Dream Note",
  	description: "Dream journal App with AI analysis built with nextJS.",
};

export default function RootLayout({
  	children,
}: Readonly<{
  	children: React.ReactNode;
}>) {

  return (
    <html lang="en">
		<body>
			<Navbar />
        	{children}
      	</body>
    </html>
  );
}
