import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '@constants': path.resolve(__dirname, 'src/core/constants'),
      '@functions': path.resolve(__dirname, 'src/core/functions'),
      '@schema': path.resolve(__dirname, 'src/core/schema'),
      '@lib': path.resolve(__dirname, 'src/lib'),
      crypto: 'node:crypto'
    }
  },
  build: {
    ssr: './src/index.ts',
    outDir: 'dist',
    target: 'node22',
    minify: true,
    rollupOptions: {
      output: { entryFileNames: 'server.js' },
      external: ['pocketbase', '@lifeforge/pocketbase', '@lifeforge/server-utils']
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  }
})
