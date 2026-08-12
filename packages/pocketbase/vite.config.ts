import { defineConfig } from 'vite'

import { externalDependencyRegex } from '@lifeforge/configs/vite'

export default defineConfig({
  build: {
    lib: {
      entry: './src/index.ts',
      formats: ['es']
    },
    outDir: 'dist',
    target: 'node22',
    rollupOptions: {
      output: { entryFileNames: 'index.js' },
      external: [externalDependencyRegex]
    }
  }
})
