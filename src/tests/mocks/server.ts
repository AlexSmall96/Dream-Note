import { setupServer } from 'msw/node'
import { chartHandlers } from './charts/handlers'
import { authHandlers } from './auth/handlers'
import { dreamsHandlers } from './dreams/handlers'
import { analysesHandlers } from './analyses/handlers'

export const handlers = [
    ...chartHandlers, 
    ...authHandlers,
    ...dreamsHandlers,
    ...analysesHandlers
]

export const server = setupServer(...handlers)