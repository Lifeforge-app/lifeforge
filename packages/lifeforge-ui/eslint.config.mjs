// Plugin imports grouped by type
import pluginJs from '@eslint/js'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import pluginReact from 'eslint-plugin-react'
import reactCompiler from 'eslint-plugin-react-compiler'
import sonarjs from 'eslint-plugin-sonarjs'
import tseslint from 'typescript-eslint'

/** @type {import('eslint').Linter.Config[]} */
export default [
  // File patterns
  {
    files: ['./src/**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    ignores: ['node_modules/', 'dist/', 'vite.config.ts', 'tailwind.config.cjs']
  },

  // Core ESLint configurations
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,

  // React configurations
  pluginReact.configs.flat.recommended,
  {
    parserOptions: {
      project: './tsconfig.json',
      tsconfigRootDir: __dirname
    }
  },
  {
    plugins: {
      'react-compiler': reactCompiler
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

  // JSX A11y
  {
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    ...jsxA11y.flatConfigs.recommended,
    languageOptions: {
      ...jsxA11y.flatConfigs.recommended.languageOptions
    }
  },

  // SonarJS
  sonarjs.configs.recommended
]
