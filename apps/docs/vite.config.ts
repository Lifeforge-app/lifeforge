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
  plugins: [react(), mdx(options), tailwindcss()]
})
