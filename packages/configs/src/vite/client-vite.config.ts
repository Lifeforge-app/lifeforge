import federation from '@originjs/vite-plugin-federation'
import babel from '@rolldown/plugin-babel'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vite'

import { SHARED_DEPS, SHARED_PACKAGES } from '../constants/shared-packages'
import { aliasResolver } from '../resolvers/alias-resolver'

/**
 * Creates the standard client/host Vite configuration for LifeForge.
 */
export function defineClientConfig(dirname: string) {
  const aliasList = [
    ...Object.entries(SHARED_PACKAGES).map(
      ([, { aliasRegex, entryPoint }]) => ({
        find: aliasRegex,
        replacement: path.resolve(dirname, '../', entryPoint)
      })
    ),
    { find: '@modules', replacement: path.resolve(dirname, '../../modules') }
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
      envDir: path.resolve(dirname, '../../env'),
      plugins: [
        {
          name: 'alias-resolver',
          enforce: 'pre',
          resolveId(source, importer) {
            if (source === '@' || source.startsWith('@/')) {
              return aliasResolver(source, importer)
            }
            return null
          }
        },
        react(),
        babel({
          presets: [reactCompilerPreset()]
        }),
        vanillaExtractPlugin({
          unstable_pluginFilter: ({ name }) => {
            return ['vite-tsconfig-paths', 'alias-resolver'].includes(name)
          }
        }),
        federation({
          name: 'host',
          remotes: {
            None: ''
          },
          shared: {
            ...SHARED_DEPS,
            ...Object.fromEntries(
              Object.keys(SHARED_PACKAGES).map(name => [name, {}])
            )
          }
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
      ssr: {
        noExternal: [
          /^@lifeforge\//,
          new RegExp(path.resolve(dirname, '../../packages')),
          new RegExp(path.resolve(dirname, '../../modules'))
        ]
      },
      build: {
        commonjsOptions: {
          transformMixedEsModules: true
        },
        target: 'esnext',
        sourcemap: false,
        rollupOptions: {
          output: {
            codeSplitting: {
              minSize: 5000
            }
          }
        }
      },
      optimizeDeps: {
        exclude: Object.keys(SHARED_PACKAGES)
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
