import { externalDependencyRegex } from '@lifeforge/configs/vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig, esmExternalRequirePlugin } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    react(),
    dts({
      entryRoot: resolve(__dirname, 'src'),
      outDirs: {
        dir: resolve(__dirname, 'dist')
      }
    }),
    esmExternalRequirePlugin({
      skipDuplicateCheck: true,
      external: [externalDependencyRegex]
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
      external: [externalDependencyRegex],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    },
    sourcemap: false,
    minify: true
  }
})
