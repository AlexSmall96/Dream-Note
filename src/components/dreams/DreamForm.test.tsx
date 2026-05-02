/**
 * @vitest-environment jsdom
 */
import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { test, expect, describe, vi } from 'vitest';
import setupTests from '@/tests/setup/setupServer'
import DreamForm from './DreamForm';
import { dreamOneData, dreamOneThemes } from '@/tests/mocks/dreams/data';
import { DreamFormType } from '@/types/dreams';
import { useState } from 'react';
import userEvent from '@testing-library/user-event';

setupTests()

const dreamFormData: DreamFormType = {
    title: dreamOneData.title,
    description: dreamOneData.description || '',
    notes: dreamOneData.notes || '',
    date: '2025-01-01'
}

const MockWrapper = ({
    themesProp = dreamOneThemes.map(t => t.theme), 
    dreamData = dreamFormData, 
    handleSubmit = vi.fn()
}: {
    themesProp?: string[], 
    dreamData?: DreamFormType, 
    handleSubmit?: (event:React.FormEvent) => Promise<any>
}) => {
    const [dream, setDream] = useState<DreamFormType>(dreamData);
    const [themes, setThemes] = useState<string[]>(themesProp);
    const [msg, setMsg] = useState<string>('')
    return(
        <DreamForm
            dream={dream}
            setDream={setDream}
            themes={themes}
            setThemes={setThemes}
            handleSubmit={handleSubmit}
            msg={msg}
            setMsg={setMsg}
            backHref='/dreams'
            backText='Back to Dashboard'
        />        
    ) 

}

describe('Dream Form should intially load with:', () => {
    test('Correct title, description, date and notes.', () => {
        render(<MockWrapper />)
        const titleInput = screen.getByRole('textbox', { name: /title/i })
        expect(titleInput).toHaveValue(dreamFormData.title)
        const descriptionInput = screen.getByRole('textbox', { name: /description/i })
        expect(descriptionInput).toHaveValue("I was climbing a steep mountain with no clear path.  The higher I went, the more difficult it became, but the view kept getting more beautiful.")
        const dateInput = screen.getByLabelText(/date/i)
        expect(dateInput).toHaveValue('2025-01-01')
        const notesInput = screen.getByRole('textbox', { name: /notes/i })
        expect(notesInput).toHaveValue(dreamFormData.notes)
    })
    test('Correct theme badges and counts.', async () => {
        render(<MockWrapper />)
        const themeBadges = screen.getAllByText(/Adventure|Challenge|Nature|Love|Fear|Achievement/)
        expect(themeBadges).toHaveLength(6)
        expect(screen.getByText('6 / 6 themes')).toBeInTheDocument()
        const dots = screen.getAllByText('•')
        expect(dots).toHaveLength(6)
    })
})

describe('Sumit button should be:', () => {
    test('Enabled if title or description are not empty, and form can be submitted.', async () => {
        const handleSubmit = vi.fn()
        render(<MockWrapper handleSubmit={handleSubmit} />)
        const submitButton = screen.getByRole('button', { name: /save dream/i })
        expect(submitButton).toBeEnabled()
        const titleInput = screen.getByRole('textbox', { name: /title/i })
        await userEvent.clear(titleInput)
        await waitFor(() => expect(submitButton).toBeEnabled())
        fireEvent.submit(screen.getByRole('form', { name: /dream form/i }))
        expect(handleSubmit).toHaveBeenCalled()
    })
    test('Disabled if title and description are empty.', async () => {
        render(<MockWrapper />)
        const submitButton = screen.getByRole('button', { name: /save dream/i })
        const titleInput = screen.getByRole('textbox', { name: /title/i })
        const descriptionInput = screen.getByRole('textbox', { name: /description/i })
        await userEvent.clear(titleInput)
        await userEvent.clear(descriptionInput)
        await waitFor(() =>{
            expect(submitButton).toBeDisabled()
        })
    })
})

describe('Theme input should be:', () => {
    test('Enabled if description is not empty and fewer than 6 themes exist.', async () => {
        render(<MockWrapper themesProp={[]} />)
        const themeInput = screen.getByRole('textbox', { name: /themes/i })
        await waitFor(() => expect(themeInput).toBeEnabled())
        
    })
    test('Disabled if description is empty.', async () => {
        render(<MockWrapper dreamData={{...dreamFormData, description: ''}} themesProp={[]} />)
        const themeInput = screen.getByRole('textbox', { name: /themes/i })
        await waitFor(() => expect(themeInput).toBeDisabled())
    })
    test('Disabled if description is not empty but 6 themes already exist.', async () => {
        render(<MockWrapper />)
        const themeInput = screen.getByRole('textbox', { name: /themes/i })
        await waitFor(() => expect(themeInput).toBeDisabled())
    })
})

describe('Add theme button should:', () => {
    test('Hidden if theme input is empty.', () => {
        render(<MockWrapper themesProp={[]} />)
        const addButton = screen.queryByRole('button', { name: /add/i })
        expect(addButton).not.toBeInTheDocument()
    })
    test('Be hidden if current theme is already in the theme list.',  async () => {
        render(<MockWrapper themesProp={['Adventure']} />)
        const themeInput = screen.getByRole('textbox', { name: /themes/i })
        await userEvent.type(themeInput, 'Adventure')
        const addButton = screen.queryByRole('button', { name: /add/i })
        expect(addButton).not.toBeInTheDocument()
    })
    test('Be visible if current theme is not empty and not already in the theme list.', async () => {
        render(<MockWrapper themesProp={['Adventure']} />)
        const themeInput = screen.getByRole('textbox', { name: /themes/i })
        await userEvent.type(themeInput, 'New Theme')
        const addButton = await screen.findByRole('button', { name: /add/i })
        expect(addButton).toBeInTheDocument()
    })
    test('Add theme to theme list and clear input when clicked.', async () => {
        render(<MockWrapper themesProp={['Adventure']} />)
        const themeInput = screen.getByRole('textbox', { name: /themes/i })
        await userEvent.type(themeInput, 'New Theme')
        const addButton = await screen.findByRole('button', { name: /add/i })
        await userEvent.click(addButton)
        expect(screen.getByText('New Theme')).toBeInTheDocument()
        expect(themeInput).toHaveValue('')
    })
})
