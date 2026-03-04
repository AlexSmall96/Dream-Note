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
      coverage: {
        provider: 'v8',           // built-in coverage tool
        reporter: ['text', 'lcov', 'html'], // text = console, lcov = CI integration, html = browsable report
        all: true,          
        include: ['server/**/*.ts'],
        exclude: [
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
        ], // dont test src folder as most files are currently untested
      }
    },
  }
})