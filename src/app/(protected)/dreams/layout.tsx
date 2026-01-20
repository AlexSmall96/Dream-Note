'use client';
import { DreamsProvider } from '@/contexts/DreamsContext';
import { ThemesAsideProvider } from '@/contexts/ThemesAsideContext';
import { ThemesProvider } from '@/contexts/ThemesContext';
import React from 'react';

export default function DreamsLayout({
	children,
	aside
}: {
	children: React.ReactNode;
	aside: React.ReactNode
}) {
	return (
		<DreamsProvider>
			<ThemesProvider>
				<div className="flex h-screen">
					<ThemesAsideProvider>
						<aside>
							{aside}
						</aside>
					</ThemesAsideProvider>
					<main className="flex-1 p-6">
						{children}
					</main>
				</div>
			</ThemesProvider>
		</DreamsProvider>
	);
}

