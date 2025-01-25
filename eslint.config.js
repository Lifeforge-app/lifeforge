import pluginJs from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import pluginReact from 'eslint-plugin-react'
import sonarjs from 'eslint-plugin-sonarjs'
import tailwind from 'eslint-plugin-tailwindcss'
import globals from 'globals'
import tseslint from 'typescript-eslint'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['./src/**/*.{js,mjs,cjs,ts,jsx,tsx}']
  },
  {
    ignores: ['node_modules/', 'dist/', 'vite.config.ts', 'tailwind.config.cjs']
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  importPlugin.flatConfigs.recommended,
  ...tailwind.configs['flat/recommended'],
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off'
    }
  },
  {
    rules: {
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      'import/order': [
        1,
        {
          groups: [
            'external',
            'builtin',
            'internal',
            'sibling',
            'parent',
            'index'
          ],
          pathGroups: [
            {
              pattern: 'typedec',
              group: 'internal'
            },
            {
              pattern: 'providers',
              group: 'internal'
            },
            {
              pattern: 'components',
              group: 'internal'
            },
            {
              pattern: 'sidebar',
              group: 'internal'
            },
            {
              pattern: 'hooks',
              group: 'internal'
            }
          ],
          pathGroupsExcludedImportTypes: ['internal'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true
          }
        }
      ]
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'],
          moduleDirectory: ['node_modules', 'src/']
        },
        alias: {
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'],
          map: [
            ['@components', './src/components/'],
            ['@providers', './src/providers/'],
            ['@hooks', './src/hooks/'],
            ['@interfaces', './src/interfaces/'],
            ['@utils', './src/utils/'],
            ['@constants', './src/constants/']
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
      ...jsxA11y.flatConfigs.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser
      }
    }
  },
  sonarjs.configs.recommended
]
