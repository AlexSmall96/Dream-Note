import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/nav/Navbar";
import RootClientWrapper from "./RootClientWrapper";

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
			<RootClientWrapper>
				<Navbar />
				{children}
			</RootClientWrapper>
		</body>
    </html>
  );
}
