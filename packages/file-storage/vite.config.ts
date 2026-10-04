import { defineConfig } from 'vite'
import { externalDependencyRegex } from '@lifeforge/configs/vite'

export default defineConfig({
  build: {
    ssr: true,
    lib: {
      entry: {
        index: './src/index.ts',
        'server/index': './src/server/index.ts'
      },
      formats: ['es']
    },
    outDir: 'dist',
    target: 'node22',
    rollupOptions: {
      output: { entryFileNames: '[name].js' },
      external: [externalDependencyRegex, /^node:/]
    }
  }
})
