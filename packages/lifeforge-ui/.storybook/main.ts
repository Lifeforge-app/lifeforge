import type { StorybookConfig } from '@storybook/react-vite'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import tsconfigPaths from 'vite-tsconfig-paths'

const require = createRequire(import.meta.url)

const ReactCompilerConfig = {
  sources: filename => {
    return true
  }
}

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    getAbsolutePath('@storybook/addon-onboarding'),
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-docs')
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
      include: ['src/**/*.tsx']
    },
    check: false,
    skipCompiler: true
  },
  async babel(config) {
    config.plugins.push(['babel-plugin-react-compiler', ReactCompilerConfig])
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
