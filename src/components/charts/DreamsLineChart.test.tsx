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

// Import components after mocks
import setupTests from '@/tests/utils/setupServer';
import { DreamChartProvider } from '@/contexts/DreamChartContext';
import DreamsLineChart from './DreamsLineChart';
import { monthLabels } from '@/tests/mocks/charts/data';
import { dreamStatsUrl } from '@/tests/mocks/charts/handlers';

setupTests()

const renderComponent = () => {
    render(
        <DreamChartProvider>
            <DreamsLineChart />
        </DreamChartProvider>
    )
}

beforeEach(() => {
    renderComponent()
})

describe('When there is data to display, DreamsLineChart should:', () => {
    test('Appear correctly.', async () => {
        const chart = await screen.findByRole('img', {name: /dream-line-chart/})
        expect(chart).toBeInTheDocument()
    })
    test('Have labels covering past 6 full months on x-axis.', async () => {
        await waitFor(() => {
            monthLabels.map(month => expect(screen.getByText(month)).toBeInTheDocument())
        })
    })
})

describe('When there is data to display, DreamsLineChart should:', () => {
    test('Not appear.', async () => {
        // Remove chart from previous render
        cleanup()
        // Update get dream stats handler to return empty data
        const handler = http.get(dreamStatsUrl, () => {
            return HttpResponse.json({
                dreamCounts: []
            }, {status: 200})
        })
        server.resetHandlers(handler)
        renderComponent()
        // Use waitFor to avoid false positive test - component renders after test
        const chart = await waitFor(() => screen.queryByRole('img', {name: /dream-line-chart/}))
        expect(chart).not.toBeInTheDocument()
    })
})
