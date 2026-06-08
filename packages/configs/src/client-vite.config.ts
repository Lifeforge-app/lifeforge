// import MillionLint from '@million/lint'
import federation from '@originjs/vite-plugin-federation'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { type UserConfig, defineConfig } from 'vite'
import { customResolver } from './resolver'

const ReactCompilerConfig = {
  sources: () => {
    return true
  }
}

export const SHARED_PACKAGES = {
  '@lifeforge/shared': {
    aliasRegex: /^@lifeforge\/shared$/,
    entryPoint: '../shared/src/index.ts'
  },
  '@lifeforge/federation': {
    aliasRegex: /^@lifeforge\/federation$/,
    entryPoint: '../packages/federation/src/index.ts'
  },
  '@lifeforge/ui': {
    aliasRegex: /^@lifeforge\/ui$/,
    entryPoint: '../packages/ui/src/index.ts'
  }
}

/**
 * Creates the standard client/host Vite configuration for LifeForge.
 */
export function defineClientConfig(dirname: string) {
  const aliasList = [
    ...Object.entries(SHARED_PACKAGES).map(([, { aliasRegex, entryPoint }]) => ({
      find: aliasRegex,
      replacement: path.resolve(dirname, entryPoint)
    })),
    { find: '@modules', replacement: path.resolve(dirname, '../apps') },
    {
      find: '@',
      replacement: '@',
      customResolver
    }
  ]

  return defineConfig(({ command }) => {
    const isDev = command === 'serve'

    const sharedAliases = new Set(
      Object.values(SHARED_PACKAGES).map(p => p.aliasRegex.toString())
    )

    const activeAlias = isDev
      ? aliasList
      : aliasList.filter(a => !sharedAliases.has(a.find.toString()))

    return {
      envDir: path.resolve(dirname, '../env'),
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
            '@tanstack/react-query',
            'i18next',
            'react-i18next',
            ...Object.keys(SHARED_PACKAGES)
          ]
        })
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
            experimentalMinChunkSize: 5000
          }
        }
      },
      optimizeDeps: {
        exclude: Object.keys(SHARED_PACKAGES),
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
}
