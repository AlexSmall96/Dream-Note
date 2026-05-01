import { setupServer } from 'msw/node'
import { chartHandlers } from './charts/handlers'
import { authHandlers } from './auth/handlers'
import { dreamsHandlers } from './dreams/handlers'

export const handlers = [
    ...chartHandlers, 
    ...authHandlers,
    ...dreamsHandlers
]

export const server = setupServer(...handlers)