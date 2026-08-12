import path from 'node:path'
import { defineConfig } from 'vite'

import { externalDependencyRegex } from './src/constants/external-dependency-regex'

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: path.resolve(__dirname, 'src/index.ts'),
        vite: path.resolve(__dirname, 'src/vite.ts')
      },
      formats: ['es'],
      fileName: '[name]'
    },
    rollupOptions: {
      external: [/^node:/, externalDependencyRegex]
    },
    outDir: 'dist',
    minify: false,
    sourcemap: true
  }
})
