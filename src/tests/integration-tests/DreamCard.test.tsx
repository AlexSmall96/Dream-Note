/**
 * @vitest-environment jsdom
 */
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { test, expect, describe, vi } from 'vitest';
import setupTests from '@/tests/setup/setupServer';
import { DreamViewProvider } from '@/contexts/DreamViewContext';
import { DreamsProvider } from '@/contexts/DreamsContext';
import { ThemesAsideProvider } from '@/contexts/ThemesAsideContext';
import { ThemesProvider } from '@/contexts/ThemesContext';
import { useParams } from 'next/navigation'
import { setScreenSize } from '@/tests/setup/setScreenSize';
import userEvent from '@testing-library/user-event';
import { dreamOneData } from '@/tests/mocks/dreams/data';

vi.mock('next/navigation', () => {
    return {
        useParams: vi.fn(),
    }
})

setupTests()

const renderWithProviders = (component: React.ReactElement) => {
    return render(
        <ThemesAsideProvider>
            <ThemesProvider>
                <DreamsProvider>
                    <DreamViewProvider>
                        {component}
                    </DreamViewProvider>
                </DreamsProvider>
            </ThemesProvider>
        </ThemesAsideProvider>
    )
}

import DreamCard from "@/components/dreams/DreamCard";

describe('Dream Card should display:', () => {
    test('Correct dream title, date and description.', async () => {
        vi.mocked(useParams).mockReturnValue({ id: '12345' })
        renderWithProviders(<DreamCard />) 
        const title = await screen.findByRole('heading', { name: dreamOneData.title })
        expect(title).toBeInTheDocument()
        const description = screen.getByText(/I was climbing a steep mountain with no clear path/i)
        expect(description).toBeInTheDocument()
        const date = screen.getByText(new Date(dreamOneData.date).toLocaleDateString())
        expect(date).toBeInTheDocument()
    })
})

describe('New theme label should be:', () => {
    test('Visible on large screens if description exists and there are fewer than 6 themes.', async () => {
        vi.mocked(useParams).mockReturnValue({ id: '67890' })
        setScreenSize('large')
        renderWithProviders(<DreamCard />) 
        const newThemeIcon = await screen.findByRole('button', { name: /New Theme/i })
        expect(newThemeIcon).toBeInTheDocument()
    })
    test('Not visible on small screens even if description exists and there are fewer than 6 themes.', async () => {
        vi.mocked(useParams).mockReturnValue({ id: '67890' })
        setScreenSize('small')
        renderWithProviders(<DreamCard />) 
        const newThemeIcon = screen.queryByRole('button', { name: /New Theme/i })
        expect(newThemeIcon).not.toBeInTheDocument()
    })
    test('Not visible if there are already 6 themes, even if description exists.', async () => {
        vi.mocked(useParams).mockReturnValue({ id: '12345' })
        setScreenSize('large')
        renderWithProviders(<DreamCard />) 
        const newThemeIcon = screen.queryByRole('button', { name: /New Theme/i })
        expect(newThemeIcon).not.toBeInTheDocument()
    })
    test('Not visible if there is no description.', async () => {
        vi.mocked(useParams).mockReturnValue({ id: '11111' })
        setScreenSize('large')
        renderWithProviders(<DreamCard />) 
        const newThemeIcon = screen.queryByRole('button', { name: /New Theme/i })
        expect(newThemeIcon).not.toBeInTheDocument()
    })
})

describe('Clicking new theme button should:', () => {
    test('Show blank theme label.', async () => {
        vi.mocked(useParams).mockReturnValue({ id: '67890' })
        setScreenSize('large')
        renderWithProviders(<DreamCard />) 
        const newThemeIcon = await screen.findByRole('button', { name: /New Theme/i })
        const user = userEvent.setup()
        await user.click(newThemeIcon)
    })
})

describe('Changes saved text should:', () => {
    test('Not be present on initial render.', async () => {
        vi.mocked(useParams).mockReturnValue({ id: '12345' })
        setScreenSize('large')
        renderWithProviders(<DreamCard />) 
        const changesSavedText = screen.queryByText(/Changes Saved/i)
        expect(changesSavedText).not.toBeInTheDocument()
    })
})


