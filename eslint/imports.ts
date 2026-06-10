import type { Linter } from 'eslint'
import importPlugin from 'eslint-plugin-import'
import unusedImports from 'eslint-plugin-unused-imports'

const config: Linter.Config[] = [
  {
    plugins: {
      import: importPlugin
    },
    rules: {
      'import/no-duplicates': 'error'
    }
  },
  {
    plugins: {
      'unused-imports': unusedImports
    },
    rules: {
      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_'
        }
      ]
    }
  }
]

export default config
