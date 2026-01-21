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
		<ThemesProvider>
			<div className="flex h-screen">
				<ThemesAsideProvider>
					<DreamsProvider>
						<aside>
							{aside}
						</aside>
						<main className="flex-1 p-6">
							{children}
						</main>
					</DreamsProvider>
				</ThemesAsideProvider>
			</div>
		</ThemesProvider>
	);
}

