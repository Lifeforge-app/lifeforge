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
      external: [
        'node:path',
        'node:fs',
        'vite',
        '@originjs/vite-plugin-federation',
        '@vitejs/plugin-react',
        '@vanilla-extract/vite-plugin',
        'zod',
        'react'
      ]
    },
    outDir: 'dist',
    minify: false,
    sourcemap: true
  }
})
