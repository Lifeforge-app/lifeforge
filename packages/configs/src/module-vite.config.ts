import federation from '@originjs/vite-plugin-federation'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { type UserConfig, defineConfig, loadEnv, mergeConfig } from 'vite'

interface ModuleConfigOptions {
  dirname: string
  pkg: {
    name: string
    [key: string]: any
  }
}

/**
 * Creates a standard Vite configuration for LifeForge modules.
 * Supports custom overrides via the second parameter.
 */
export function defineModuleConfig(
  { dirname, pkg }: ModuleConfigOptions,
  overrides: UserConfig | ((env: any) => UserConfig) = {}
) {
  const isDocker = process.env.DOCKER_BUILD === 'true'
  const outDir = isDocker ? 'dist-docker' : 'dist'
  const moduleName = pkg.name.replace('@lifeforge/', '')

  return defineConfig((configEnv) => {
    const isDev = configEnv.command === 'serve'

    // 1. Resolve environment variables natively from the root env folder
    const envDir = path.resolve(dirname, '../../../env')
    const env = loadEnv(configEnv.mode, envDir, '')
    const apiHost = isDocker ? '/api' : env.VITE_API_HOST

    if (!apiHost) {
      throw new Error('VITE_API_HOST is not defined')
    }

    // 2. Base default configuration
    const baseConfig: UserConfig = {
      base: `${apiHost}/modules/${moduleName}/`,
      envDir,
      plugins: [
        react(),
        federation({
          name: moduleName,
          filename: 'remoteEntry.js',
          exposes: {
            './Manifest': './manifest.ts'
          },
          shared: {
            react: { generate: false },
            'react-dom': { generate: false },
            '@lifeforge/shared': { generate: false },
            '@lifeforge/federation': { generate: false },
            '@lifeforge/ui': { generate: false },
            'react-i18next': { generate: false },
            i18next: { generate: false },
            '@tanstack/react-query': { generate: false }
          }
        })
      ],
      resolve: {
        alias: [
          ...(isDev
            ? [
                {
                  find: /^@lifeforge\/shared$/,
                  replacement: path.resolve(dirname, '../../../shared/src/index.ts')
                },
                {
                  find: /^@lifeforge\/federation$/,
                  replacement: path.resolve(
                    dirname,
                    '../../../packages/federation/src/index.ts'
                  )
                },
                {
                  find: /^@lifeforge\/ui$/,
                  replacement: path.resolve(
                    dirname,
                    '../../../packages/ui/src/index.ts'
                  )
                }
              ]
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
    const resolvedOverrides = typeof overrides === 'function' 
      ? overrides(configEnv) 
      : overrides

    // 4. Merge base configuration with the module-specific overrides
    return mergeConfig(baseConfig, resolvedOverrides)
  })
}
