import { test } from "vitest";
import { sendAndAssertEmail } from "./utils";

// Tests

test('Email should be sent with correct data for password reset.', async () => {
    sendAndAssertEmail(true, 123456, 10)
})
test('Email should be sent with correct data for email address update.', async () => {
    sendAndAssertEmail(false, 358652, 5)
})


