/**
 * @vitest-environment jsdom
 */
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { test, expect, beforeEach, describe} from 'vitest';
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

describe('If it is active and there is theme data to display, CustomToolTip should:', () => {
    test('Appear correctly.', () => {
        const tooltip = screen.getByRole('tooltip', {name: /custom-tooltip/})
        expect(tooltip).toBeInTheDocument()
    })
    test('Show each theme with correct value.', () => {
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

describe('If it is active and there is dream data to display, CustomToolTip should:', () => {
    test('Show the correct dream count.', () => {
        cleanup()
        render(
            <CustomTooltip active payload={[{name: 'dreams', value: 2}]} label='Jan' />
        )
        const dreamsPar = screen.getByRole('paragraph', {name: /dreams/})
        expect(dreamsPar).toHaveTextContent('dreams: 2')

    })
})

describe('CustomTooltip should not appear if:', () => {
    test('It is inactive.', () => {
        cleanup()
        render(
            <CustomTooltip  payload={payload} label='Jan' />
        )
        const tooltip = screen.queryByRole('tooltip', {name: /custom-tooltip/})
        expect(tooltip).not.toBeInTheDocument()        
    })
    test('There is no data to display.', () => {
        cleanup()
        render(
            <CustomTooltip active label='Jan' />
        )
        const tooltip = screen.queryByRole('tooltip', {name: /custom-tooltip/})
        expect(tooltip).not.toBeInTheDocument()          
    })
    test('The data array is empty.', () => {
        cleanup()
        render(
            <CustomTooltip active payload={[]} label='Jan' />
        )
        const tooltip = screen.queryByRole('tooltip', {name: /custom-tooltip/})
        expect(tooltip).not.toBeInTheDocument()          
    })
})
