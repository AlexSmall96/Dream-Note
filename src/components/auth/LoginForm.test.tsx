/**
 * @vitest-environment jsdom
 */
import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { test, expect, describe, vi } from 'vitest';
import setupTests from '@/tests/setup/setupServer';
import LoginForm from './LoginForm';
import * as api from '@/lib/api/auth';
import { userEvent, UserEvent } from '@testing-library/user-event';

setupTests()

function setup() {
    render(<LoginForm />)

    const user = userEvent.setup()

    const emailInput = screen.getByRole('textbox', { name: /email/i })
    const passwordInput = screen.getByLabelText(/^password$/i)

    const loginButton = screen.getByRole('button', { name: /login/i })
    const guestButton = screen.getByRole('button', { name: /continue as guest/i })

    const signupLink = screen.getByRole('link', { name: /sign up/i })
    const resetLink = screen.getByRole('link', { name: /reset password/i })

    return {
        user,
        emailInput,
        passwordInput,
        inputs: [emailInput, passwordInput],
        loginButton,
        guestButton,
        signupLink,
        resetLink,

        async enterEmail(email: string) {
            await user.clear(emailInput)
            await user.type(emailInput, email)
        },

        async enterPassword(password: string) {
            await user.clear(passwordInput)
            await user.type(passwordInput, password)
        },

        async submit() {
            await user.click(loginButton)
        },

        async loginAsGuest (){
            await user.click(guestButton)

        }
    }
}

type PageType = {
    user: UserEvent;
    emailInput: HTMLElement;
    passwordInput: HTMLElement;
    loginButton: HTMLElement;
    guestButton: HTMLElement;
    inputs: HTMLElement[];
    signupLink: HTMLElement;
    resetLink: HTMLElement;
    enterEmail(email: string): Promise<void>;
    enterPassword(password: string): Promise<void>;
    submit(): Promise<void>;
    loginAsGuest(): Promise<void>;
}

const enterData = async (page:PageType, email: string, password?: string) => {
    await page.enterEmail(email)
    if (password){
        await page.enterPassword(password)
    }
}

describe('Login form should initially appear with:', () => {
    test('Blank inputs, disabled login button and enabled guest button.', () => {
        const page = setup()

        expect(page.emailInput).toHaveValue('')
        expect(page.passwordInput).toHaveValue('')
        expect(page.loginButton).toBeDisabled()
        expect(page.guestButton).toBeEnabled()
    })

    test('Error message not present.', () => {
        expect(screen.queryByRole('alert')).toBeNull()
    })

    test('Messages present, along with sign up and reset password links.', async () => {
        const page = setup()

        expect(screen.getByText(/Don't have an account\?/)).toBeInTheDocument()
        expect(screen.getByText(/Forgotten password\?/)).toBeInTheDocument()
        expect(page.signupLink).toBeInTheDocument()
        expect(page.resetLink).toBeInTheDocument()
        expect(page.signupLink).toHaveAttribute('href', '/auth/signup')
        expect(page.resetLink).toHaveAttribute('href', '/auth/reset-password')
    })
})

describe('Login button:', () => {
    test('Remains disabled if at least 1 input is blank.', async () => {
        const page = setup()
        await enterData(page, 'user1@email.com')
        expect(page.loginButton).toBeDisabled()

        // The code to keep the button disabled is symmetric with regards to both inputs, so the above assertion is sufficient
    })
    test('Becomes enabled when both inputs are filled.', async () => {
        const page = setup()
        await enterData(page, 'user1@email.com', 'orange123')
        expect(page.loginButton).toBeEnabled()       
    })

    test('Becomes disabled while login request is pending.', async () => {
        // Create unresolved promise to mock pending log in
        const promise = new Promise(() => {})
        vi.spyOn(api, 'login').mockReturnValue(promise as any)

        const page = setup()   
        const { user } = page
        await enterData(page, 'user1@email.com', 'orange123')
        const button = page.loginButton
        await user.click(button)

        const { inputs } = page
        await waitFor(() => {
            inputs.forEach(input => expect(input).toBeDisabled())
            expect(button).toBeDisabled()
            expect(button).toHaveTextContent('Logging in...')
        })
    })

    test('Remains disabled if error is returned from login request, until user changes an input.', async () => {
        const page = setup()   
        const { user, loginButton } = page
        await enterData(page, 'user2@email.com', 'orange123')
        await user.click(loginButton)   

        const alert = await screen.findByRole('alert')
        expect(alert).toHaveTextContent('Incorrect email or password.')
        expect(loginButton).toBeDisabled()

        await page.enterEmail('anything')
        expect(loginButton).toBeEnabled()
    })
})

describe('Continue as guest button:', () => {
    test('Becomes disabled while login request is pending.', async () => {
        const promise = new Promise(() => {})
        vi.spyOn(api, 'login').mockReturnValue(promise as any)
        const page = setup()   
        const { user, loginButton, guestButton } = page
        await enterData(page, 'user1@email.com', 'orange123')
        await user.click(loginButton)       
        expect(guestButton).toBeDisabled()
    })

    test('Becomes enabled if error is returned from login request.', async () => {
        const page = setup()   
        const { user, loginButton, guestButton } = page
        await enterData(page, 'user2@email.com', 'orange123')
        await user.click(loginButton)      
        expect(guestButton).toBeEnabled()   
    })
})
