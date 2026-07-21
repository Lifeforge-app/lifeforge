import path from 'node:path'
import { defineConfig } from 'vite'

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
      external: [/^node:/, /^([a-zA-Z0-9_-]+|@[a-zA-Z0-9_-]+\/)/]
    },
    outDir: 'dist',
    minify: false,
    sourcemap: true
  }
})
