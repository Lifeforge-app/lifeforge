// import MillionLint from '@million/lint'
import federation from '@originjs/vite-plugin-federation'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import react from '@vitejs/plugin-react'
import { globSync } from 'glob'
import path from 'node:path'
import { type Alias, defineConfig } from 'vite'

const ReactCompilerConfig = {
  sources: filename => {
    return true
  }
}

export const alias: Alias[] = [
  {
    find: /^@lifeforge\/shared$/,
    replacement: path.resolve(__dirname, '../shared/src/index.ts')
  },
  {
    find: /^@lifeforge\/ui$/,
    replacement: path.resolve(__dirname, '../packages/ui/src/index.ts')
  },
  {
    find: '@providers',
    replacement: path.resolve(__dirname, './src/providers')
  },
  { find: '@utils', replacement: path.resolve(__dirname, './src/utils') },
  { find: '@core', replacement: path.resolve(__dirname, './src/core') },
  { find: '@modules', replacement: path.resolve(__dirname, '../apps') },
  {
    find: '@',
    replacement: '@',
    customResolver: (id, importer, options) => {
      let rootDir = ''
      const isAppModule =
        importer?.includes('/apps/') &&
        importer?.includes('/client/') &&
        !importer?.includes('/client/src/')

      if (importer?.endsWith('manifest.ts')) {
        rootDir = importer.replace('manifest.ts', 'src/')
      } else if (isAppModule) {
        const clientMatch = importer?.match(/(.+\/client)\//)
        rootDir = clientMatch?.[1] || ''
      } else {
        rootDir = importer?.split('/src/')[0] + '/src' || ''
      }

      const matched = globSync([
        path.resolve(rootDir, id.slice(2) + '.{tsx,ts,json}'),
        path.resolve(rootDir, id.slice(2), 'index.{tsx,ts}'),
        path.resolve(rootDir, id.slice(2))
      ])
      if (!matched[0]) {
        console.log([
          path.resolve(rootDir, id.slice(2) + '.{tsx,ts,json}'),
          path.resolve(rootDir, id.slice(2), 'index.{tsx,ts}'),
          path.resolve(rootDir, id.slice(2))
        ])
        console.log(
          `[vite] failed to resolve import "${id}" from "${importer}"`
        )
        return null
      }
      return matched[0]
    }
  }
]

export default defineConfig(({ command }) => {
  const isDev = command === 'serve'
  const activeAlias = isDev
    ? alias
    : alias.filter(a => {
        if (a.find instanceof RegExp) {
          return (
            !a.find.test('@lifeforge/shared') && !a.find.test('@lifeforge/ui')
          )
        }
        return a.find !== '@lifeforge/shared' && a.find !== '@lifeforge/ui'
      })

  return {
    envDir: path.resolve(__dirname, '../env'),
    plugins: [
      // MillionLint.vite({}),
      react({
        babel: {
          plugins: [['babel-plugin-react-compiler', ReactCompilerConfig]]
        }
      }),
      vanillaExtractPlugin(),
      federation({
        name: 'host',
        remotes: {
          None: ''
        },
        shared: [
          'react',
          'react-dom',
          '@lifeforge/shared',
          '@lifeforge/ui',
          '@tanstack/react-query',
          'i18next',
          'react-i18next'
        ]
      })
    ],
    server: {
      fs: {
        strict: true
      },
      watch: {
        ignored: ['**/node_modules/**', '**/.git/**']
      },
      allowedHosts: ['_.melvinchia.dev']
    },
    resolve: {
      alias: activeAlias
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
            }
          }
        }
      }
    },
    optimizeDeps: {
      exclude: ['@lifeforge/shared', '@lifeforge/ui'],
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
  }
})
