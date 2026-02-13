import { test } from "vitest";
import { sendAndAssertEmail } from './utils/emailUtils.js';

// Tests

test('Email should be sent with correct data for password reset.', async () => {
    sendAndAssertEmail('password-reset', '123456', 10)
})
test('Email should be sent with correct data for email address update.', async () => {
    sendAndAssertEmail('email-update', '358652', 5)
})


