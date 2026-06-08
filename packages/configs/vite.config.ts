import path from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index'
    },
    rollupOptions: {
      external: [
        'node:path',
        'node:fs',
        'vite',
        '@originjs/vite-plugin-federation',
        '@vitejs/plugin-react',
        '@vanilla-extract/vite-plugin'
      ]
    },
    outDir: 'dist',
    minify: false,
    sourcemap: true
  }
})
