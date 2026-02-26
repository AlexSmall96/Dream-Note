import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    pool: "forks", 
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    include: ['server/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text-summary'],
      reportsDirectory: './coverage',
      include: ['server/**/*.{ts,js}'],
      exclude: [
        'server/server.ts',
        'src/**',
        'node_modules/**',
        '**/*.test.*'
      ]
    },
    setupFiles: ["./test/setupEnv.ts"],
  },
});