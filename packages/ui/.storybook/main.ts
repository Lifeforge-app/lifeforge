// This file has been automatically migrated to valid ESM format by Storybook.
import type { StorybookConfig } from '@storybook/react-vite'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import tsconfigPaths from 'vite-tsconfig-paths'

const require = createRequire(import.meta.url)

const federationStubPlugin = {
  name: 'storybook-federation-stub',
  resolveId(id: string) {
    if (id === 'virtual:__federation__') {
      return '\0virtual:__federation__'
    }
    return null
  },
  load(id: string) {
    if (id === '\0virtual:__federation__') {
      return `
        export const __federation_method_setRemote = () => {}
        export const __federation_method_getRemote = () => Promise.resolve(null)
        export const __federation_method_unwrapDefault = (m) => m?.default ?? m
      `
    }
    return null
  }
}

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath('storybook-addon-deep-controls')
  ],
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {}
  },
  typescript: {
    reactDocgen:
      process.env.NODE_ENV === 'production'
        ? 'react-docgen-typescript'
        : 'react-docgen',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      tsconfigPath: '../tsconfig.json',
      include: ['./src/**/*.tsx']
    },
    check: false,
    skipCompiler: true
  },
  viteFinal: async config => {
    config.plugins = [
      ...(config.plugins ?? []).filter(p => {
        if (p && typeof p === 'object' && 'name' in p) {
          return p.name !== 'vite:dts'
        }
        return true
      }),
      federationStubPlugin,
      tsconfigPaths()
    ]
    config.build = {
      ...config.build
    }
    return {
      ...config
    }
  }
}

export default config

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')))
}
