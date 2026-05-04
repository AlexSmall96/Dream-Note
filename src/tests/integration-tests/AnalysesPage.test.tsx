/**
 * @vitest-environment jsdom
 */
import '@testing-library/jest-dom/vitest';
import { screen, waitFor } from '@testing-library/react';
import { test, expect, describe, vi } from 'vitest';
import setupTests from '@/tests/setup/setupServer'
import DreamAnalysisPage from '@/app/(protected)/dreams/[id]/analysis/page';
import { renderWithProviders } from '../utils/renderWithProviders';
import userEvent from '@testing-library/user-event';
import { setScreenSize } from '../setup/setScreenSize';

vi.mock('next/navigation', () => {
    return {
        useRouter: vi.fn(),
    }
})

setupTests()

const user = userEvent.setup()

describe('Breadcrumbs navigation should show:', () => {
    test('Dream title and "/Analyses" on small screens when no analysis is selected.', async () => {
        setScreenSize('small')
        renderWithProviders(<DreamAnalysisPage params={{id: '12345'}} />)
        const dreamTitle = await waitFor(() => screen.getByRole('button', {name: /Mountain/i}))
        expect(dreamTitle).toBeInTheDocument()
        const analysesCrumb = screen.getByRole('button', {name: /Analyses/i})
        expect(analysesCrumb).toBeInTheDocument()
        const selectedAnalysisCrumb = screen.queryByText(/Selected Analysis/i)
        expect(selectedAnalysisCrumb).not.toBeInTheDocument()
    })
    test('Dream title, "/Analyses" and "Selected Analysis" on small screens when analysis is selected.', async () => {
        setScreenSize('small')
        renderWithProviders(<DreamAnalysisPage params={{id: '12345'}} />)
        const analysisOne = await waitFor(() => screen.getByText(/This dream could symbolize/i))
        expect(analysisOne).toBeInTheDocument()
        await user.click(analysisOne)
        const selectedAnalysisCrumb = await waitFor(() => screen.getByText(/Selected Analysis/i))
        expect(selectedAnalysisCrumb).toBeInTheDocument()
        // Clicking analyses should remove selected analysis crumb
        const analysesCrumb = screen.getByRole('button', {name: /Analyses/i})
        await user.click(analysesCrumb)
        expect(screen.queryByText(/Selected Analysis/i)).not.toBeInTheDocument()
    })
    test('Dream title, "/Analyses" and "Selected Analysis" on extra large screens, regardless of selection.', async () => {
        setScreenSize('extraLarge')
        renderWithProviders(<DreamAnalysisPage params={{id: '12345'}} />)
        const selectedAnalysisText = await screen.findByText(/Selected Analysis/i)
        expect(selectedAnalysisText).toBeInTheDocument()
    })
})

describe('Analyses list should show:', () => {
    test('All analyses when filter is set to all.', async () => {
        renderWithProviders(<DreamAnalysisPage params={{id: '12345'}} />)
        const analysisOne = await waitFor(() => screen.getByText(/This dream could symbolize/i))
        expect(analysisOne).toBeInTheDocument()
        const analysisTwo = await waitFor(() => screen.getByText(/This dream may represent/i))
        expect(analysisTwo).toBeInTheDocument()
    })
    test('Only favorite analyses when filter is set to favorites.', async () => {
        renderWithProviders(<DreamAnalysisPage params={{id: '12345'}} />)
        const favsButton = await waitFor(() => screen.getByRole('tab', {name: 'Favorites'}))
        await user.click(favsButton)
        const analysisOne = await waitFor(() => screen.getByText(/This dream could symbolize/i))
        expect(analysisOne).toBeInTheDocument()
        const analysisTwo = screen.queryByText(/This dream may represent/i)
        expect(analysisTwo).not.toBeInTheDocument()
    })
})

describe('Selecting an analysis should show:', () => {
    test('The full analysis text and description snapshot, without analyses list on small screens.', async () => {
        setScreenSize('small')
        renderWithProviders(<DreamAnalysisPage params={{id: '12345'}} />)
        const analysisOne = await waitFor(() => screen.getByText(/This dream could symbolize/i))
        expect(analysisOne).toBeInTheDocument()
        await user.click(analysisOne)
        const mainAnalysis = await waitFor(() => screen.getByTestId('main-analysis'))
        expect(mainAnalysis).toBeInTheDocument()
        expect(mainAnalysis).toHaveTextContent(/This dream could symbolize your current struggles and challenges in life/i)
        const descriptionSnapshot = screen.getByText(/I was climbing a steep mountain with no clear path./i)
        expect(descriptionSnapshot).toBeInTheDocument()
        const analysisTwo = screen.queryByText(/This dream may represent/i)
        expect(analysisTwo).not.toBeInTheDocument()
        const tabs = screen.queryByRole('tablist')
        expect(tabs).not.toBeInTheDocument()
    })
    test('The full analysis text and description snapshot, with analyses list on extra large screens.', async () => {
        setScreenSize('extraLarge')
        renderWithProviders(<DreamAnalysisPage params={{id: '12345'}} />)
        const analysisTwo = await waitFor(() => screen.getByText(/This dream may represent/i))
        expect(analysisTwo).toBeInTheDocument()
        await user.click(analysisTwo)
        const mainAnalysis = await waitFor(() => screen.getByTestId('main-analysis'))
        expect(mainAnalysis).toBeInTheDocument()
        expect(mainAnalysis).toHaveTextContent(/This dream may represent your resilience and determination in overcoming obstacles/i)
        const descriptionSnapshot = screen.getByText(/I was climbing a very difficult mountain with no clear path./i)
        expect(descriptionSnapshot).toBeInTheDocument()
        const analysisOne = screen.getByText(/This dream could symbolize/i)
        expect(analysisOne).toBeInTheDocument()
        const tabs = screen.queryByRole('tablist')
        expect(tabs).toBeInTheDocument()
    })
})

describe('Settings should:', () => {
    test('Be hidden intially, with settings button visible.', async () => {
        renderWithProviders(<DreamAnalysisPage params={{id: '12345'}} />)
        const settingsButton = await waitFor(() => screen.getByRole('button', {name: /Settings/i}))
        expect(settingsButton).toBeInTheDocument()
        const settingsText = screen.queryByText(/Tone|Style|Length/i)
        expect(settingsText).not.toBeInTheDocument()
    })
    test('Be visible when settings button is clicked.', async () => {
        renderWithProviders(<DreamAnalysisPage params={{id: '12345'}} />)
        const settingsButton = await waitFor(() => screen.getByRole('button', {name: /Settings/i}))
        await user.click(settingsButton)
        const settings = [/Tone/i, /Style/i, /Length/i]
        settings.forEach(setting => expect(screen.getByText(setting)).toBeInTheDocument())
    })
})

describe('Generate new analysis modal should:', () => {
    test('Be hidden intially, with generate button visible.', async () => {
        renderWithProviders(<DreamAnalysisPage params={{id: '12345'}} />)
        const generateButton = await waitFor(() => screen.getByRole('button', {name: /Generate new AI analysis/i}))
        expect(generateButton).toBeInTheDocument()
        const modalText = screen.queryByText(/An imaginative analysis/i)
        expect(modalText).not.toBeInTheDocument()
    })
    test('Be visible with analysis text when generate button is clicked.', async () => {
        renderWithProviders(<DreamAnalysisPage params={{id: '12345'}} />)
        const generateButton = await waitFor(() => screen.getByRole('button', {name: /Generate new AI analysis/i}))
        await user.click(generateButton)
        const analysisText = await waitFor(() => screen.getByText(/An imaginative analysis/i))
        expect(analysisText).toBeInTheDocument()
    })
    test('Close when discard button is clicked.', async () => {
        renderWithProviders(<DreamAnalysisPage params={{id: '12345'}} />)
        const generateButton = await waitFor(() => screen.getByRole('button', {name: /Generate new AI analysis/i}))
        await user.click(generateButton)
        const discardButton = await waitFor(() => screen.getByRole('button', {name: /Discard/i}))
        await user.click(discardButton)
        const analysisText = screen.queryByText(/An imaginative analysis/i)
        expect(analysisText).not.toBeInTheDocument()
    })
    test('Show different analysis text based on settings.', async () => {
        renderWithProviders(<DreamAnalysisPage params={{id: '12345'}} />)
        const settingsButton = await waitFor(() => screen.getByRole('button', {name: /Settings/i}))
        await user.click(settingsButton)
        const realisticOption = screen.getByRole('radio', { name: /Realistic/i })
        await user.click(realisticOption)
        const generateButton = screen.getByRole('button', {name: /Generate new AI analysis/i})
        await user.click(generateButton)
        const analysisText = await waitFor(() => screen.getByText(/A realistic analysis/i))
        expect(analysisText).toBeInTheDocument()
    })
    test('Allow generated analysis to be saved.', async () => {
        renderWithProviders(<DreamAnalysisPage params={{id: '12345'}} />)
        const generateButton = await waitFor(() => screen.getByRole('button', {name: /Generate new AI analysis/i}))
        await user.click(generateButton)
        const analysisText = await waitFor(() => screen.getByText(/An imaginative analysis/i))
        expect(analysisText).toBeInTheDocument()
        const saveButton = await waitFor(() => screen.getByRole('button', {name: /Save/i}))
        await user.click(saveButton)
        // Saved text should appear
        const savedText = await waitFor(() => screen.getByText(/Analysis saved/i))
        expect(savedText).toBeInTheDocument()
        // Save button should be hidden and view all analyses button should be visible
        expect(screen.queryByRole('button', {name: /Save/i})).not.toBeInTheDocument()
        const viewAllButton = screen.getByRole('button', {name: /View all analyses/i})
        expect(viewAllButton).toBeInTheDocument()
        // Clicking view all should hide modal
        await user.click(viewAllButton)
        expect(screen.queryByText(/An imaginative analysis/i)).not.toBeInTheDocument()
    })
})





