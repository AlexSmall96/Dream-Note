'use client';
import { DreamsProvider } from '@/contexts/DreamsContext';
import { DreamChartProvider } from '@/contexts/DreamChartContext';
import { ThemesAsideProvider } from '@/contexts/ThemesAsideContext';
import { ThemesProvider } from '@/contexts/ThemesContext';
import { ThemeChartProvider } from '@/contexts/ThemeChartContext'
import React from 'react';
import { DreamCountsProvider } from '@/contexts/DreamCountsContext';

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
						<DreamCountsProvider>
						<ThemeChartProvider>
							<DreamChartProvider>
								<aside>
									{aside}
								</aside>
								<main className="flex-1 p-6">
									{children}
								</main>
							</DreamChartProvider>
						</ThemeChartProvider>
						</DreamCountsProvider>
					</DreamsProvider>
				</ThemesAsideProvider>
			</div>
		</ThemesProvider>
	);
}

