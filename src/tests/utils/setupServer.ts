import { server } from '@/tests/mocks/server'
import { afterEach, beforeAll, afterAll, beforeEach } from 'vitest';
import { cleanup  } from '@testing-library/react';
import { handlers } from '@/tests/mocks/handlers'

const setupTests = () => {
    beforeAll(() => {
        server.listen()
    })
    
    beforeEach(() => {
        server.resetHandlers(...handlers)
    })
    
    afterEach(() => {
        cleanup()
    })
      
    afterAll(() => {
        server.close()
    })
}

export default setupTests