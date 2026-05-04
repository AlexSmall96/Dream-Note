import { DreamViewProvider } from '@/contexts/DreamViewContext';
import { ThemesProvider } from '@/contexts/ThemesContext';
import { ThemesAsideProvider } from '@/contexts/ThemesAsideContext';
import { render } from '@testing-library/react';


export const renderWithProviders = (component: React.ReactElement) => {
    return (
        render(
            <ThemesAsideProvider>
                <ThemesProvider>
                    <DreamViewProvider>
                        {component}
                    </DreamViewProvider>
                </ThemesProvider>
            </ThemesAsideProvider>
        )

    )
}