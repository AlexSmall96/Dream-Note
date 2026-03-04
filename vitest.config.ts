import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'
import { loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [tsconfigPaths()],
    define: { 'process.env': env },
    test: {
      environment: 'node', // default for backend
      include: ['server/**/*.test.ts', 'src/**/*.test.{ts,tsx}'],
      environmentMatchGlobs: [
        ['src/**', 'jsdom'],     // frontend = jsdom
        ['server/**', 'node'],   // backend = node
      ],
      setupFiles: ['./test/setupEnv.ts'],
      pool: 'forks',
      poolOptions: {
        forks: { singleFork: true },
      },
    },
  }
})