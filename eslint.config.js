import js from '@eslint/js';
import globals from 'globals';
import process from 'node:process';
import tseslint from 'typescript-eslint';
import { importsConfig, reactConfig, sonarConfig, storiesConfig, styleConfig, testsConfig } from './eslint/index';
const config = [
    {
        ignores: [
            '**/*.config.ts',
            '**/*.config.js',
            '**/dist/',
            'dist/',
            'tools/src/templates/**',
            '**/storybook-static/'
        ]
    },
    {
        files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.browser
            },
            sourceType: 'module',
            parserOptions: {
                project: './tsconfig.eslint.json',
                tsconfigRootDir: process.cwd(),
                sourceType: 'module'
            }
        }
    },
    // JS/TS Presets
    js.configs.recommended,
    ...tseslint.configs.recommended,
    // Feature / Plugin Configs
    ...reactConfig,
    ...sonarConfig,
    ...importsConfig,
    ...styleConfig,
    ...testsConfig,
    ...storiesConfig
];
export default config;
