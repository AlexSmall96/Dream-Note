import { setupServer } from 'msw/node'
import { chartHandlers } from './charts/handlers'
import { authHandlers } from './auth/handlers'

export const handlers = [
    ...chartHandlers, 
    ...authHandlers
]

export const server = setupServer(...handlers)