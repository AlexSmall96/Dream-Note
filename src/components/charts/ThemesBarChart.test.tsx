/**
 * @vitest-environment jsdom
 */
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { test, expect, vi, beforeEach, describe} from 'vitest';
import { http, HttpResponse } from "msw";
import { server } from '@/tests/mocks/server'

// Mock refetch bool var in DreamsContext to avoid rendering unecessary contexts
vi.mock('../../contexts/DreamsContext', async (importOriginal) => {
    const actual: {} = await importOriginal()
    return {
        ...actual,
        useDreams: () => ({
        refetch: true, 
        }),
    }
})

// Mock recharts bars to make roles accessible
vi.mock('recharts', async () => {
  const actual = await vi.importActual<any>('recharts')
  return {
    ...actual,
    Bar: ({ dataKey }: any) => (
      <div role="img" aria-label={`bar-${dataKey}`} />
    ),
  }
})

// Import components after mocks
import ThemesBarChart from '@/components/charts/ThemesBarChart';
import { ThemeChartProvider } from '@/contexts/ThemeChartContext';
import setupTests from '@/tests/utils/setupServer';
import { monthLabels, themes } from '@/tests/mocks/data';
import { themeStatsUrl } from '@/tests/mocks/handlers';

setupTests()

beforeEach(() => {
    render(
        <ThemeChartProvider>
            <ThemesBarChart />
        </ThemeChartProvider>
    )
})

describe('When non empty, valid data is fetched, ThemeBarChart should:', () => {

    test('Render correctly.', async () => {
        const chart = await screen.findByRole('img', {name: /themes-chart/})
        expect(chart).toBeInTheDocument()
    })

    test('Have labels covering past 6 full months on x-axis', async () => {
        await waitFor(() => {
            monthLabels.map(month => expect(screen.getByText(month)).toBeInTheDocument())
        })
    })

    test('Display correct number of bars.', async () => {
        const bars = await screen.findAllByRole('img', {name: /bar/})
        expect(bars).toHaveLength(5)
    })

    test('Render the bars with correct theme names.', async () => {
        for (const theme of themes) {
            await screen.findByRole('img', {
                name: `bar-${theme}`,
            })
        }
    })
})

describe('When top themes or monthly counts is empty, ThemeBarChart should:', () => {
    test('Render null.', async () => {
        // Remove chart from previous render
        cleanup()
        // Update get theme stats handler to return empty data
        const handler = http.get(themeStatsUrl, () => {
            return HttpResponse.json({
                themes: [], data: []
            }, {status: 200})
        })
        server.resetHandlers(handler)
        render(
            <ThemeChartProvider>
                <ThemesBarChart />
            </ThemeChartProvider>
        )
        // Use waitFor to avoid false positive test - component renders after test
        const chart = await waitFor(() => screen.queryByRole('img', {name: /themes-chart/}))
        expect(chart).not.toBeInTheDocument()
    })
})




