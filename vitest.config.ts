import { defineConfig } from 'vitest/config'
import dotenv from 'dotenv'

dotenv.config(); // loads .env automatically

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
})