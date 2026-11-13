import type { Linter } from 'eslint'

const config: Linter.Config[] = [
  {
    files: ['apps/web/**/*.{tsx,jsx}', 'modules/**/*.{tsx,jsx}'],
    rules: {
      'local/no-native-elements': 'error'
    }
  }
]

export default config
