/**
 * @vitest-environment jsdom
 */
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { test, expect, vi, beforeEach, describe} from 'vitest';
import setupTests from '@/tests/utils/setupServer';
import CustomTooltip, { TooltipPayloadItem } from './CustomTooltip';
import { themes } from '@/tests/mocks/data';

const COLORS = [
    "#7f79f7",
    "#8bdbbc",
    "#a616f9",
    "#44c7ef",
    "#2203d6"
]

const payload: TooltipPayloadItem[] = []
themes.map((theme, index) => payload.push({
    name: theme,
    value: 2 * index + 1,
    color: COLORS[index]
}))

setupTests()

beforeEach(() => {
    render(
        <CustomTooltip active payload={payload} label='Jan' />
    )
})

describe('If all props are passed in, CustomToolTip should:', () => {
    test('Render correctly.', () => {
        const tooltip = screen.getByRole('img', {name: /custom-tooltip/})
        expect(tooltip).toBeInTheDocument()
    })
    test('Render each theme with correct value.', () => {
        themes.forEach((theme, index) => {
            const regEx = new RegExp(theme)
            const themePar = screen.getByRole('paragraph', {name: regEx})
            expect(themePar).toBeInTheDocument()
            expect(themePar).toHaveTextContent(`${theme}: ${2 * index + 1}`)
        })
    })
    test('Show the correct month label.', () => {
        const monthLabel = screen.getByRole('paragraph', {name: /Jan/})
        expect(monthLabel).toBeInTheDocument()
    })
})

describe('CustomTooltip should not appear if:', () => {
    test('It is inactive.', () => {
        cleanup()
        render(
            <CustomTooltip  payload={payload} label='Jan' />
        )
        const tooltip = screen.queryByRole('img', {name: /custom-tooltip/})
        expect(tooltip).not.toBeInTheDocument()        
    })
    test('There is no data to display.', () => {
        cleanup()
        render(
            <CustomTooltip active label='Jan' />
        )
        const tooltip = screen.queryByRole('img', {name: /custom-tooltip/})
        expect(tooltip).not.toBeInTheDocument()          
    })
    test('The data array is empty.', () => {
        cleanup()
        render(
            <CustomTooltip active payload={[]} label='Jan' />
        )
        const tooltip = screen.queryByRole('img', {name: /custom-tooltip/})
        expect(tooltip).not.toBeInTheDocument()          
    })
})
