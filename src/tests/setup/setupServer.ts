import { server } from '@/tests/mocks/server'
import { afterEach, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import { cleanup  } from '@testing-library/react';
import { handlers } from '@/tests/mocks/server'
import { setScreenSize } from './setScreenSize';

const setupTests = () => {
    beforeAll(() => {
        server.listen()
    })
    
    beforeEach(() => {
        server.resetHandlers(...handlers)
        vi.restoreAllMocks()
        setScreenSize('large')
    })
    
    afterEach(() => {
        cleanup()
    })
      
    afterAll(() => {
        server.close()
    })
}

export default setupTests