import type { Linter } from 'eslint'

const config: Linter.Config[] = [
  {
    files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
]

export default config
