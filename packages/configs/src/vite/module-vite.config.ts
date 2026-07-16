import federation from '@originjs/vite-plugin-federation'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import { type UserConfig, defineConfig, loadEnv, mergeConfig } from 'vite'

import { SHARED_DEPS, SHARED_PACKAGES } from '../constants/shared-packages'

interface ModuleConfigOptions {
  dirname: string
  pkg?: {
    name: string
    [key: string]: any
  }
}

/**
 * Creates a standard Vite configuration for LifeForge modules.
 * Supports custom overrides via the second parameter.
 */
export function defineModuleConfig(
  { dirname, pkg: customPkg }: ModuleConfigOptions,
  overrides: UserConfig | ((env: any) => UserConfig) = {}
) {
  const isDocker = process.env.DOCKER_BUILD === 'true'

  const outDir = isDocker ? 'dist-docker' : 'dist'

  const pkg =
    customPkg ||
    JSON.parse(
      fs.readFileSync(path.resolve(dirname, '../package.json'), 'utf8')
    )

  const moduleName = pkg.name.replace('@lifeforge/', '')

  return defineConfig(configEnv => {
    const isDev = configEnv.command === 'serve'

    // 1. Resolve environment variables natively from the root env folder
    const envDir = path.resolve(dirname, '../../../env')

    const env = loadEnv(configEnv.mode, envDir, '')

    const apiHost = isDocker ? '/api' : env.VITE_API_HOST

    // 2. Base default configuration
    const baseConfig: UserConfig = {
      base: `${apiHost}/modules/${moduleName}/`,
      envDir,
      plugins: [
        react(),
        vanillaExtractPlugin(),
        federation({
          name: moduleName,
          filename: 'remoteEntry.js',
          exposes: {
            './Manifest': './manifest.ts'
          },
          remotes: {
            None: ''
          },
          shared: {
            ...Object.fromEntries(
              Object.entries(SHARED_DEPS).map(([name, config]) => [
                name,
                { ...config, generate: false }
              ])
            ),
            ...Object.fromEntries(
              Object.keys(SHARED_PACKAGES).map(e => [e, { generate: false }])
            )
          }
        })
      ],
      resolve: {
        alias: [
          ...(isDev
            ? Object.entries(SHARED_PACKAGES).map(
                ([, { aliasRegex, entryPoint }]) => ({
                  find: aliasRegex,
                  replacement: path.resolve(dirname, '/../../', entryPoint)
                })
              )
            : []),
          {
            find: /^@\/manifest$/,
            replacement: path.resolve(dirname, './manifest.ts')
          },
          { find: /^@\/(.*)$/, replacement: path.resolve(dirname, './src/$1') },
          { find: /^@$/, replacement: path.resolve(dirname, './src/index') }
        ]
      },
      build: {
        outDir,
        target: 'esnext',
        modulePreload: false
      }
    }

    // 3. Resolve custom overrides if they are passed as a function
    const resolvedOverrides =
      typeof overrides === 'function' ? overrides(configEnv) : overrides

    // 4. Merge base configuration with the module-specific overrides
    return mergeConfig(baseConfig, resolvedOverrides)
  })
}
