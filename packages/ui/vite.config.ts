import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig, esmExternalRequirePlugin } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    react(),
    vanillaExtractPlugin(),
    dts({
      entryRoot: resolve(__dirname, 'src')
    }),
    esmExternalRequirePlugin({
      skipDuplicateCheck: true,
      external: [/^([a-zA-Z0-9_-]+|@[a-zA-Z0-9_-]+\/)/]
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: format => `index.${format === 'es' ? 'mjs' : 'js'}`
    },
    rollupOptions: {
      external: [/^([a-zA-Z0-9_-]+|@[a-zA-Z0-9_-]+\/)/],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        },
        assetFileNames: 'index.[ext]'
      }
    },
    sourcemap: false,
    minify: true
  }
})
