import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mkcert()],
  server: {
    https: false
  },
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './src/components/general'),
      '@providers': path.resolve(__dirname, './src/providers'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@sidebar': path.resolve(__dirname, './src/components/Sidebar')
    }
  }
})
