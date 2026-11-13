import { defineConfig } from 'vite'

import { externalDependencyRegex } from '@lifeforge/configs/vite'

export default defineConfig({
  build: {
    lib: {
      entry: {
        registry: './src/registry/index.ts',
        loader: './src/loader/index.ts'
      },
      formats: ['es']
    },
    outDir: 'dist',
    target: 'node22',
    rollupOptions: {
      output: { entryFileNames: '[name]/index.js' },
      external: [externalDependencyRegex]
    }
  }
})
