"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/contexts/CurrentUserContext";
import { DreamsProvider } from '@/contexts/DreamsContext';
import { DreamChartProvider } from '@/contexts/DreamChartContext';
import { ThemesAsideProvider } from '@/contexts/ThemesAsideContext';
import { ThemeChartProvider } from '@/contexts/ThemeChartContext'
import React from 'react';
import { DreamCountsProvider } from '@/contexts/DreamCountsContext';
import Navbar from '@/components/nav/Navbar';
import { AsideContent } from "@/components/nav/AsideContent";
import { ThemesProvider } from "@/contexts/ThemesContext";

export default function ProtectedLayout({
  	children,
}: {
  	children: React.ReactNode
}) {
    const router = useRouter();
    const {currentUser, loading } = useCurrentUser()
    
    useEffect(() => {
      	if (!loading && !currentUser) {
        	router.replace("/auth/login");
      	}
    }, [loading, currentUser, router])

	if (loading || !currentUser) return null

    return (
		<ThemesAsideProvider>
			<ThemesProvider> 
				<div className="flex flex-col h-screen">
					
						<DreamsProvider>
							<DreamCountsProvider>
								<ThemeChartProvider>
									<DreamChartProvider>
										<Navbar />
										<div className="flex flex-1">
											<aside className="hidden md:block w-80">
												<AsideContent />
											</aside>
											<main className="flex-1 px-0 sm:px-4 md:px-6">
												{children}
											</main>
										</div>
									</DreamChartProvider>
								</ThemeChartProvider>
							</DreamCountsProvider>
						</DreamsProvider>
				</div>
			</ThemesProvider>
		</ThemesAsideProvider>
    )
}
