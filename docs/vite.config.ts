import mdx, { Options } from '@mdx-js/rollup'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import remarkGfm from 'remark-gfm'
import { defineConfig } from 'vite'

import mdxListCountsPlugin from './plugins/mdxListCountsPlugin'

const options: Options = {
  remarkPlugins: [remarkGfm]
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mdx(options), tailwindcss(), mdxListCountsPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true
    },
    target: 'esnext',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id
              .toString()
              .split('node_modules/')
              .pop()!
              .split('/')[0]
              .toString()
          } else if (id.endsWith('.mdx')) {
            const mdxPath = id.toString().split('src/')[1]
            return `mdx-${mdxPath.replace(/\//g, '-').replace('.mdx', '')}`
          }
        }
      }
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      sourcemap: false,
      target: 'esnext'
    }
  }
})
