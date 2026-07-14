import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      crypto: 'node:crypto'
    }
  },
  build: {
    ssr: './src/index.ts',
    outDir: 'dist',
    target: 'node22',
    minify: true,
    rollupOptions: {
      output: {
        entryFileNames: 'forge.js',
        format: 'cjs'
      }
    }
  }
})
