import type { StorybookConfig } from '@storybook/react-vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const ReactCompilerConfig = {
  sources: filename => {
    return true
  }
}

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions'
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {}
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
