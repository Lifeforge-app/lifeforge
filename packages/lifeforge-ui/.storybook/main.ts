// This file has been automatically migrated to valid ESM format by Storybook.
import type { StorybookConfig } from '@storybook/react-vite'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import tsconfigPaths from 'vite-tsconfig-paths'

const require = createRequire(import.meta.url)

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
    config.plugins = [...(config.plugins ?? []), tsconfigPaths()]
    config.plugins.push((await import('@tailwindcss/vite')).default())
    return {
      ...config
    }
  }
}

export default config

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')))
}
