import type { Linter } from 'eslint'
import perfectionist from 'eslint-plugin-perfectionist'

const config: Linter.Config[] = [
  {
    files: ['**/*.stories.tsx', '**/*.stories.ts'],
    plugins: { perfectionist },
    rules: {
      'sort-keys': 'off',
      'perfectionist/sort-objects': [
        'error',
        { type: 'natural', order: 'asc', ignoreCase: true }
      ]
    }
  }
]

export default config
