import mdx from '@mdx-js/rollup'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import { defineConfig } from 'vite'

const options = {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [rehypeHighlight]
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mdx(options), tailwindcss()],
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
