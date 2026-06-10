import type { Linter } from 'eslint'
import sonarjs from 'eslint-plugin-sonarjs'

const config: Linter.Config[] = [
  {
    ...sonarjs.configs?.recommended,
    rules: {
      'sonarjs/prefer-read-only-props': 'off'
    }
  } as Linter.Config
]

export default config
