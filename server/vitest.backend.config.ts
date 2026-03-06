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
      include: ['server/**/*.test.ts'],
      environmentMatchGlobs: [
        ['server/**', 'node'],   // backend = node
      ],
      setupFiles: ['./test/setupEnv.ts', './test/setupBackend.ts'],
      pool: 'forks',
      poolOptions: {
        forks: { singleFork: true },
      },
      hookTimeout: 60000,
      testTimeout: 60000,
      coverage: {
        provider: 'v8',           // built-in coverage tool
        reporter: ['text', 'lcov', 'html'], // text = console, lcov = CI integration, html = browsable report
        all: true,          
        include: ['server/**/*.ts'],
        exclude: [
          '**/*.config.*',
          '**/*.setup.*',
          '**/*.test.ts',
          '**/*.test.tsx',
          'node_modules/',
          'dist/',
          'test/',
          '**/*.d.ts',
          '**/*.mjs',
          '**/*.js',
          'src/**',
          '.next/**',
          'public/**'
        ],
      },
      maxThreads: 1,
      minThreads: 1
    },
  }
})