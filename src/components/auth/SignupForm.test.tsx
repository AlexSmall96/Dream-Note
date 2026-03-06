/**
 * @vitest-environment jsdom
 */
import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { test, expect, describe, vi } from 'vitest';
import setupTests from '@/tests/utils/setupServer';
import SignupForm from '@/components/auth/SignupForm'
import { userEvent, UserEvent } from '@testing-library/user-event'
import * as api from '@/lib/api/auth';

setupTests()

function setup() {
    render(<SignupForm />)

    const user = userEvent.setup()

    const emailInput = screen.getByRole('textbox', { name: /email/i })
    const passwordInput = screen.getByLabelText(/^password$/i)
    const confirmInput = screen.getByLabelText(/^confirm password$/i)

    const button = screen.getByRole('button', { name: /sign up/i })

    const loginLink = screen.getByRole('link', { name: /login/i })

    return {
        user,
        emailInput,
        passwordInput,
        confirmInput,
        inputs: [emailInput, passwordInput, confirmInput],
        button,
        loginLink,

        async enterEmail(email: string) {
            await user.clear(emailInput)
            await user.type(emailInput, email)
        },

        async enterPassword(password: string) {
            await user.clear(passwordInput)
            await user.type(passwordInput, password)
        },

        async confirmPassword(password: string) {
            await user.clear(confirmInput)
            await user.type(confirmInput, password)
        },

        async submit() {
            await user.click(button)
        }
    }
}

type PageType = {
    user: UserEvent;
    emailInput: HTMLElement;
    passwordInput: HTMLElement;
    confirmInput: HTMLElement;
    inputs: HTMLElement[];
    button: HTMLElement;
    loginLink: HTMLElement;
    enterEmail(email: string): Promise<void>;
    enterPassword(password: string): Promise<void>;
    confirmPassword(password: string): Promise<void>;
    submit(): Promise<void>;
}

const enterData = async (page:PageType, email: string, password: string, confirmPassword?: string) => {
    await page.enterEmail(email)
    await page.enterPassword(password)
    if (confirmPassword){
        await page.confirmPassword(confirmPassword)    
    }
}
 
// Tests

describe('Signup form should initially appear with:', () => {
    test('Blank inputs and disabled sign up button.', () => {
        const page = setup()

        expect(page.emailInput).toHaveValue('')
        expect(page.passwordInput).toHaveValue('')
        expect(page.confirmInput).toHaveValue('')
        expect(page.button).toBeDisabled()
    })

    test('No error messages present.', () => {
        expect(screen.queryAllByRole('alert')).toHaveLength(0)
    })

    test('Message and login link present.', async () => {
        const page = setup()

        expect(screen.getByText(/Already have an account\?/)).toBeInTheDocument()
        expect(page.loginLink).toBeInTheDocument()
        expect(page.loginLink).toHaveAttribute('href', '/auth/login')
    })
})

describe('Sign up button:', () => {
    test('Remains disabled if at least 1 input is blank.', async () => {
        const page = setup()
        await enterData(page, 'user1@email.com', 'orange123')
        expect(page.button).toBeDisabled()

        // The code to keep the button disabled is symmetric with regards to all 3 inputs, so the above assertion is sufficient
    })

    test('Becomes enabled when all 3 inputs are filled.', async () => {
        const page = setup()
        await enterData(page, 'user1@email.com', 'orange123', 'orange123')
        expect(page.button).not.toBeDisabled()       
    })

    test('Becomes disabled while signup request is pending.', async () => {
        // Create unresolved promise to mock sign up
        const promise = new Promise(() => {})
        vi.spyOn(api, 'signup').mockReturnValue(promise as any)

        const page = setup()   
        const { user } = page
        await enterData(page, 'user1@email.com', 'orange123', 'orange123')
        const button = page.button
        await user.click(button)

        const { inputs } = page
        await waitFor(() => {
            inputs.forEach(input => expect(input).toBeDisabled())
            expect(button).toBeDisabled()
            expect(button).toHaveTextContent('Signing up...')
        })
    })

    test('Remains disabled if error is returned from signup, until user changes the input causing error.', async () => {
        const page = setup()   
        const { user } = page
        await enterData(page, 'user1@email.com', 'orange123', 'apple123')
        const button = page.button
        await user.click(button)   

        // This test focuses on the errors interaction with the button, so it is sufficient to assert error existence
        // Specific errors are tested in the next describe block
        await screen.findAllByRole('alert')
        expect(button).toBeDisabled()

        // Change the input that caused error to enable button
        await page.confirmPassword('anything')
        expect(button).not.toBeDisabled()
    })

    test('Remains disabled if sign up is successful, until user changes an input value.', async () => {
        const page = setup()   
        const { user } = page
        await enterData(page, 'user2@email.com', 'orange123', 'orange123')
        const button = page.button
        await user.click(button)

        expect(await screen.findByText(/Signup successful/i)).toBeInTheDocument()
        expect(button).toBeDisabled()

        await page.enterEmail('user3@email.com')
        // Message should be back to default 
        expect(await screen.findByText(/Already have an account\?/i)).toBeInTheDocument()
        expect(button).not.toBeDisabled()
    })
})

describe('Error messages appear after sign up request when:', () => {
    test('Password and confirm password dont match.', async () => {
        const page = setup()   
        const { user } = page 
        await enterData(page, 'user2@email.com', 'orange123', 'apple123')
        const button = page.button
        await user.click(button)
        
        const errors = await screen.findAllByRole('alert')
        expect(errors).toHaveLength(1)
        expect(errors[0]).toHaveTextContent('Password and confirm password must match.')

        // Change email and error remains
        await page.enterEmail('user3')
        expect(screen.getAllByRole('alert')).toHaveLength(1)
        // Change password input to remove error (either password input can be changed, see below)
        await page.enterPassword('orange12')
        expect(screen.queryAllByRole('alert')).toHaveLength(0)
    })

    // Password error may also be "password must be at least 8 characters"
    // Not required to test both errors as logic is agnostic of specific message
    test('Password contains the word password.', async () => {
        const page = setup()   
        const { user } = page 
        await enterData(page, 'user2@email.com', 'password', 'password')
        const button = page.button
        await user.click(button)
        
        const errors = await screen.findAllByRole('alert')
        expect(errors).toHaveLength(1)
        expect(errors[0]).toHaveTextContent('Password cannot contain "password".')

        // Change confirm password input to remove error
        await page.confirmPassword('or')
        expect(screen.queryAllByRole('alert')).toHaveLength(0)        
    })

    // Email error may also be "please provide a vaid email address"
    // Not required to test both errors 
    test('Email address is taken.', async () => {
        const page = setup()   
        const { user } = page 
        await enterData(page, 'user1@email.com', 'orange123', 'orange123')  
        const button = page.button
        await user.click(button)
        
        const errors = await screen.findAllByRole('alert')
        expect(errors).toHaveLength(1)
        expect(errors[0]).toHaveTextContent('Email address already in use.')    
        
        // Change email input to remove error
        await page.enterEmail('user4')
        expect(screen.queryAllByRole('alert')).toHaveLength(0)

        // See above tests for assertions that changing the other input doesnt remove error
    })
})
