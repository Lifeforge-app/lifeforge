// import MillionLint from '@million/lint'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import { type Alias, defineConfig } from 'vite'

const ReactCompilerConfig = {
  sources: filename => {
    return true
  }
}

export const alias: Alias[] = [
  {
    find: '@providers',
    replacement: path.resolve(__dirname, './src/core/providers')
  },
  { find: '@utils', replacement: path.resolve(__dirname, './src/core/utils') },
  { find: '@apps', replacement: path.resolve(__dirname, './src/apps') },
  { find: '@core', replacement: path.resolve(__dirname, './src/core') },
  { find: '@server', replacement: path.resolve(__dirname, '../server/src') },
  { find: '@modules', replacement: path.resolve(__dirname, '../apps') },
  {
    find: '@',
    replacement: '@',
    customResolver: (id, importer, options) => {
      if (id.startsWith('@/')) {
        const rootDir = importer?.split('/src/')[0] || ''
        const matched = fs.globSync(
          path.resolve(rootDir, 'src', id.slice(2) + '.{tsx,ts}')
        )
        return matched[0]
      }
      return null
    }
  }
]

export default defineConfig({
  envDir: path.resolve(__dirname, '../env'),
  plugins: [
    // MillionLint.vite({}),
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', ReactCompilerConfig]]
      }
    }),
    tailwindcss()
  ],
  server: {
    fs: {
      strict: true
    },
    watch: {
      ignored: ['**/node_modules/**', '**/.git/**']
    }
  },
  resolve: {
    alias
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
              .split('node_modules/')[1]
              .split('/')[0]
              .toString()
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
  },
  css: {
    postcss: {
      plugins: [
        {
          postcssPlugin: 'internal:charset-removal',
          AtRule: {
            charset: atRule => {
              if (atRule.name === 'charset') {
                atRule.remove()
              }
            }
          }
        }
      ]
    }
  }
})
