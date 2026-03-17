'use client';
import { DreamsProvider } from '@/contexts/DreamsContext';
import { DreamChartProvider } from '@/contexts/DreamChartContext';
import { ThemesAsideProvider } from '@/contexts/ThemesAsideContext';
import { ThemesProvider } from '@/contexts/ThemesContext';
import { ThemeChartProvider } from '@/contexts/ThemeChartContext'
import React from 'react';
import { DreamCountsProvider } from '@/contexts/DreamCountsContext';
import Navbar from '@/components/nav/Navbar';

export default function DreamsLayout({
	children,
	aside
}: {
	children: React.ReactNode;
	aside: React.ReactNode
}) {
	return (
		<ThemesProvider> 
			<div className="flex flex-col h-screen">
				<ThemesAsideProvider>
					<DreamsProvider>
						<DreamCountsProvider>
							<ThemeChartProvider>
								<DreamChartProvider>
									<Navbar />
									<div className="flex flex-1">
										<aside className="hidden md:block w-80">
											{aside}
										</aside>
										<main className="flex-1 p-6">
											{children}
										</main>
									</div>
								</DreamChartProvider>
							</ThemeChartProvider>
						</DreamCountsProvider>
					</DreamsProvider>
				</ThemesAsideProvider>
			</div>
		</ThemesProvider>
	);
}

