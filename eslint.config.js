import pluginJs from '@eslint/js'
import pluginQuery from '@tanstack/eslint-plugin-query'
import importPlugin from 'eslint-plugin-import'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import pluginReact from 'eslint-plugin-react'
import reactCompiler from 'eslint-plugin-react-compiler'
import sonarjs from 'eslint-plugin-sonarjs'
import path from 'path'
import process from 'process'
// import tailwind from 'eslint-plugin-tailwindcss'
import tseslint from 'typescript-eslint'

// Get the project root directory
const projectRoot = process.cwd()
const srcPath = path.resolve(projectRoot, 'src')

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['./src/**/*.{js,mjs,cjs,ts,jsx,tsx}']
  },
  {
    ignores: ['node_modules/', 'dist/', 'vite.config.ts', 'tailwind.config.cjs']
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  importPlugin.flatConfigs.recommended,
  // ...tailwind.configs['flat/recommended'],
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
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
    rules: {
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off'
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'],
          moduleDirectory: ['node_modules', 'src']
        },
        alias: {
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'],
          map: [
            ['@components', path.resolve(srcPath, 'components')],
            ['@providers', path.resolve(srcPath, 'core/providers')],
            ['@hooks', path.resolve(srcPath, 'core/hooks')],
            ['@interfaces', path.resolve(srcPath, 'core/interfaces')],
            ['@utils', path.resolve(srcPath, 'core/utils')],
            ['@modules', path.resolve(srcPath, 'modules')]
          ]
        }
      },
      react: {
        version: 'detect'
      }
    }
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    ...jsxA11y.flatConfigs.recommended,
    languageOptions: {
      ...jsxA11y.flatConfigs.recommended.languageOptions
    }
  },
  sonarjs.configs.recommended,
  {
    plugins: {
      'react-compiler': reactCompiler
    },
    rules: {
      'react-compiler/react-compiler': 'error'
    }
  },
  ...pluginQuery.configs['flat/recommended']
]
