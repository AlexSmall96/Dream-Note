/**
 * @vitest-environment jsdom
 */
import React from 'react';
import Home from './page.js'
import '@testing-library/jest-dom/vitest';
import { screen, render} from '@testing-library/react';
import { test, expect} from 'vitest';

test('Dream note text renders.', () => {
    render(<Home />)
    const dreamNote = screen.getByText('Dream Note')
    expect(dreamNote).toBeInTheDocument()
})

