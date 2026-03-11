/**
 * @vitest-environment jsdom
 */
import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { test, expect, describe, vi } from 'vitest';
import setupTests from '@/tests/setup/setupServer'
import ResetPasswordForm from './ResetPasswordForm';
import userEvent from '@testing-library/user-event';
import * as api from '@/lib/api/auth';

setupTests()

function setup(token: string = 'valid-token') {
    render(<ResetPasswordForm  token={token} />)

    const user = userEvent.setup()

    const passwordInput = screen.getByLabelText(/^password$/i)
    const confirmInput = screen.getByLabelText(/confirm password/i)

    const inputs = [passwordInput, confirmInput]
    const submitButton = screen.getByRole('button', { name: /change password/i })
    
    return {
        user,
        passwordInput,
        confirmInput,
        inputs,
        submitButton, 

        async enterPassword(password: string) {
            await user.clear(passwordInput)
            await user.type(passwordInput, password)
        },

        async confirmPassword(password: string) {
            await user.clear(confirmInput)
            await user.type(confirmInput, password)
        },

        async submit(){
            await user.click(submitButton)
        },

        async submitPassword(password:string = 'apple123'){
            await this.enterPassword(password)
            await this.confirmPassword(password)
            await this.submit()
        }
    }
}

describe('Login form should initially appear with:', () => {
    test('Blank inputs and disabled button.', () => {
        const page = setup()
        const { passwordInput, confirmInput, submitButton } = page

        expect(passwordInput).toHaveValue('')
        expect(confirmInput).toHaveValue('')
        expect(submitButton).toBeDisabled()
    })
    test('Error message not present.', () => {
        expect(screen.queryByRole('alert')).toBeNull()
    })
    test('No links are present.', () => {
        expect(screen.queryAllByRole('link', { name: /login/i })).toHaveLength(0)
    })
})

describe('Submit button:', () => {
    test('Remains disabled if at least 1 input is blank.', async () => {
        const page = setup()
        await page.enterPassword('apple123')
        expect(page.submitButton).toBeDisabled()
    })
    test('Remains disabled if passwords do not match.', async () => {
        const page = setup()    
        await page.enterPassword('apple123')
        await page.confirmPassword('apple1234')
        expect(page.submitButton).toBeDisabled()
    })
    test('Becomes enabled when inputs are filled and passwords match.', async () => {
        const page = setup()
        await page.enterPassword('apple123')
        await page.confirmPassword('apple123')
        expect(page.submitButton).toBeEnabled()
    })
    test('Becomes disabled while request is pending.', async () => {
        const promise = new Promise(() => {})
        vi.spyOn(api, 'resetPassword').mockReturnValue(promise as any)
        const page = setup()
        await page.submitPassword()
        const { inputs, submitButton } = page
        await waitFor(() => {
            inputs.forEach(input => expect(input).toBeDisabled())
            expect(submitButton).toBeDisabled()
            expect(submitButton).toHaveTextContent('Changing password...')
        })
    })
    test('Remains disabled if password error is returned from request, until user changes input.', async () => {
        const page = setup()
        await page.submitPassword('password123')
        const error = await screen.findByRole('alert') 
        expect(error).toHaveTextContent('Password cannot contain "password".')
        await page.enterPassword('apple123')
        await page.confirmPassword('apple123')
        expect(error).not.toBeInTheDocument()
        expect(page.submitButton).toBeEnabled()
    })
})

describe('If password is correct and request is sent, submit button should be replaced with:', () => {
    test('Link to new reset password request, when token is invalid.', async () => {
        const page = setup('invalid-token')
        await page.submitPassword()
        const link = await screen.findByRole('link', { name: /request new password reset/i })
        expect(link).toBeInTheDocument()
        expect(link).toHaveAttribute('href', '/auth/reset-password')
        expect(screen.queryByRole('button', { name: /change password/i })).toBeNull()
    })
    test('Link to login page and new reset password request, when token is valid.', async () => {
        const page = setup('valid-token')
        await page.submitPassword()
        const loginLink = await screen.findByRole('link', { name: /login/i })
        const resetLink = await screen.findByRole('link', { name: /reset password/i })
        const message = await screen.findByText(/password reset successful/i)
        expect(loginLink).toBeInTheDocument()
        expect(loginLink).toHaveAttribute('href', '/auth/login')
        expect(resetLink).toBeInTheDocument()
        expect(resetLink).toHaveAttribute('href', '/auth/reset-password')
        expect(message).toBeInTheDocument()
        expect(screen.queryByRole('button', { name: /change password/i })).toBeNull()
    })
})