/**
 * @vitest-environment jsdom
 */
import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { test, expect, describe, vi } from 'vitest';
import setupTests from '@/tests/setup/setupServer'

setupTests()

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        refresh: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
        prefetch: vi.fn(),
    }),
}))

const mockRequestFn = vi.fn(() => {
    // Return generic message - in reality this message would not indicate if otp has been sent
    // This component is used for password resets and email updates but the logic is agnostic of ths specific message/purpose
    return Promise.resolve({message: "Otp sent"})
})

const mockVerifyFn = vi.fn((data: {otp:string, email: string}) => {
    const { otp } = data
    if (otp === '123456'){
        // Return generic success message
        return Promise.resolve({message: 'Otp correct'})
    }
    return Promise.resolve({errors:[{msg:'Invalid or expired OTP', param: 'otp', value: otp}]})
})

import EmailForm from '@/components/forms/EmailForm';

import userEvent from '@testing-library/user-event';
import { ErrorResponse, SuccessResponse } from '@/types/responses';

function setup({
    requestFn = mockRequestFn,
    verifyFn = mockVerifyFn
}:{
    requestFn?: typeof mockRequestFn
    verifyFn?: typeof mockVerifyFn
}={}){

    render(
        <EmailForm<{otp: string, email: string}> 
            emailPlaceholder='Enter your email address' 
            emailButtonText='recover your password'
            requestFn={requestFn}
            verifyFn={verifyFn}
            buildVerifyPayload={(otp, email) => ({otp, email})} 
        />
    )
    const user = userEvent.setup()

    const emailInput = screen.getByRole('textbox', { name: /email/i })
    const button = screen.getByRole('button', { name: /Send OTP to recover your password/i })

    return {
        emailInput,
        button,
        user,

        async enterEmail(email: string) {
            await user.clear(emailInput)
            await user.type(emailInput, email)
        },

        async clickButton(){
            await user.click(button)
        },

        async submitEmailAndWait(email: string){
            await this.enterEmail(email)
            await this.clickButton()
            await screen.findByText(/otp sent/i) 
        },

        async findOtpInput(email: string = 'user1@email.com'){
            await this.submitEmailAndWait(email)
            const otpInput = await screen.findByRole('textbox', { name: /otp/i })
            return otpInput
        },

        async enterOTP(otp: string){
            // Check if otp input is already present - if not, submit email first
            const otpInput = screen.queryByRole('textbox', { name: /otp/i }) ?? await this.findOtpInput()
            await user.type(otpInput, otp)
        },

        async submitOtp(otp:string){
            await this.enterOTP(otp)
            await user.click(button)
        }

    }
}

describe('Email form initially appears with:', () => {
    test('Email input blank and button disabled.', () => {
        const page = setup()
        const { emailInput, button } = page
        expect(emailInput).toHaveValue('')
        expect(button).toBeDisabled()
    })
    test('Error message is not present.', () => {
        expect(screen.queryByRole('alert')).toBeNull()
    })
    test('Otp input is not present.', () => {
        expect(screen.queryByRole('textbox', {name: /otp/i})).toBeNull()
    })
})

describe('When button has text "Send OTP" it:', () => {
    test('Becomes enabled if email input is filled.', async () => {
        const page = setup()
        await page.enterEmail('user1@email.com')
        await waitFor(() => expect(page.button).toBeEnabled())
    })

    test('Becomes disabled while send otp request is pending, and text changes.', async () => {
        // Return a promise that never resolves to test pending state
        const unresolvedFn = vi.fn(() => new Promise<ErrorResponse | SuccessResponse>(() => {}))
        const page = setup({requestFn:unresolvedFn})
        const { emailInput, button } = page
        await page.enterEmail('user1@email.com')  
        await page.clickButton()     
        await waitFor(() => expect(page.button).toBeDisabled())
        expect(button).toHaveTextContent('Sending OTP...')
        expect(emailInput).toBeDisabled()
    })

    test('Becomes disabled when message is returned, text changes to "Verify OTP" and emailInput is cleared.', async  () => {
        const page = setup()
        await page.submitEmailAndWait('user1@email.com')
        const { button, emailInput } = page
        await waitFor(() => expect(button).toBeDisabled())
        expect(button).toHaveTextContent('Verify OTP')
        expect(emailInput).toHaveValue('')
    })
})

describe('When button has text "Verify OTP":', () => {
    test('It is disabled when otp input is blank.', async () => {
        const page = setup()
        const otp = await page.findOtpInput()   
        expect(otp).toHaveValue('')
        await waitFor(() => expect(page.button).toBeDisabled())
    })
    test('Email input is not present.', async () => {
        const page = setup()
        await page.findOtpInput()   
        expect(screen.queryByRole('textbox', { name: /email/i })).toBeNull()      
    })

    test('It becomes enabled if otp input is filled in.', async () => {
        const page = setup()
        await page.enterOTP('123456')
        const { button } = page
        await waitFor(() => expect(button).toBeEnabled())      
    })
    test('It becomes disabled while verify otp request is pending, and text changes.', async () => {
        const unresolvedFn = vi.fn((_data: { otp: string; email: string }) => {
        // Return a promise that never resolves to test pending state
            return new Promise<ErrorResponse | SuccessResponse >(() => {});
        });
        const page = setup({verifyFn: unresolvedFn})
        await page.submitOtp('123456')
        const { button } = page
        await waitFor(() => expect(button).toBeDisabled())
        expect(button).toHaveTextContent('Verifying OTP...')
    })    
})

describe('When otp has been sent:', () => {
    test('Error message appears if otp is incorrect, and button remains disabled until input is changed.', async () => {
        const page = setup()
        await page.submitOtp('112233')
        const alert = await screen.findByRole('alert')
        expect(alert).toHaveTextContent('Invalid or expired OTP')
        await page.enterOTP('1')
        const { button } = page
        await waitFor(() => expect(button).toBeEnabled())
        expect(alert).not.toBeVisible()
    })

    test('Sucess message appears if otp is correct.', async () => {
        const page = setup()
        await page.submitOtp('123456')   
        const message = await screen.findByText(/Otp correct/i)
        expect(message).toBeVisible()
    })

    // This file tested the case where there is no reset token in the response
    // If a reset token is provided in the response, the user is redirected to reset password page
    // This functionality will be tested in an integration test
})


