import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts', 'scripts/release.ts'],
      exclude: ['src/types.ts'],
      reporter: ['text', 'html', 'clover'],
    },
  },
})
