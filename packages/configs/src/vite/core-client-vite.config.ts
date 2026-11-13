import { federation } from '@module-federation/vite'
import babel from '@rolldown/plugin-babel'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import path from 'node:path'
import { type Plugin, defineConfig } from 'vite'

import { SHARED_DEPS, SHARED_PACKAGES } from '../constants/shared-packages'
import { clientAliasResolver } from '../resolvers/client-alias-resolver'

/**
 * The `modules` directory lives outside the web app's Vite root. Vite only
 * watches files already in the module graph, so a module installed while the
 * dev server is running wouldn't be picked up by the dev-mode
 * `import.meta.glob` (used to resolve modules from source) until a restart.
 * Watching the directory keeps that glob fresh on install/removal.
 */
function watchModulesDir(dirname: string): Plugin {
  return {
    name: 'lifeforge:watch-modules',
    apply: 'serve',
    configureServer(server) {
      server.watcher.add(path.resolve(dirname, '../../modules'))
    }
  }
}

/**
 * Creates the standard client/host Vite configuration for LifeForge.
 */
export function defineCoreClientConfig(dirname: string) {
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
        watchModulesDir(dirname),
        {
          name: 'alias-resolver',
          enforce: 'pre',
          resolveId(source: string, importer: string | undefined) {
            if (source === '@' || source.startsWith('@/')) {
              return clientAliasResolver(source, importer)
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
        !isDev &&
          federation({
            name: 'host',
            dts: false,
            remotes: {
              None: ''
            },
            shared: {
              ...Object.fromEntries(
                Object.entries(SHARED_DEPS).map(([name, config]) => [
                  name,
                  { ...config, singleton: true }
                ])
              ),
              ...Object.fromEntries(
                Object.keys(SHARED_PACKAGES).map(name => [
                  name,
                  { singleton: true }
                ])
              )
            }
          })
      ].filter(Boolean),
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
