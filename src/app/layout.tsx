import type { Metadata } from "next";
import Link from 'next/link';

import "./globals.css";

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
        <Link href='/'>
          Dream Note
        </Link>
		<Link className='m-2' href='/auth/signup'>
			Signup
		</Link>
		<Link className='m-2' href='/auth/login'>
			Login
		</Link>
		<Link className='m-2' href='/dreams'>
			Dreams
		</Link>
		<Link className='m-2' href='/profile'>
			Profile
		</Link>
        {children}
      </body>
    </html>
  );
}
