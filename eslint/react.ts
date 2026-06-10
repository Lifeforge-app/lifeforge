import type { Linter } from 'eslint'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import pluginReact from 'eslint-plugin-react'
import reactCompiler from 'eslint-plugin-react-compiler'

const config: Linter.Config[] = [
  pluginReact.configs.flat.recommended as Linter.Config,
  {
    plugins: {
      'react-compiler': reactCompiler,
      react: pluginReact
    },
    rules: {
      'react-compiler/react-compiler': 'error',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-sort-props': [
        'error',
        {
          callbacksLast: true,
          shorthandFirst: true,
          shorthandLast: false,
          ignoreCase: true,
          noSortAlphabetically: false,
          reservedFirst: true
        }
      ]
    }
  },
  {
    files: ['**/*.{js,jsx,ts,tsx,mjs,cjs}'],
    ...jsxA11y.flatConfigs.recommended,
    rules: {
      'jsx-a11y/no-autofocus': 'off'
    }
  } as Linter.Config
]

export default config
