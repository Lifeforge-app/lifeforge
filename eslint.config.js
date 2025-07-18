import js from "@eslint/js";
import jsxA11y from "eslint-plugin-jsx-a11y";
import pluginReact from "eslint-plugin-react";
import reactCompiler from "eslint-plugin-react-compiler";
import sonarjs from "eslint-plugin-sonarjs";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import path from "node:path";
import process from "node:process";
import tseslint from "typescript-eslint";

export default [
  // Files to be included and ignored
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    ignores: [
      "eslint.config.js",
      "*.config.js",
      "vite.config.ts",
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/out/**",
      "**/build/**",
      "**/coverage/**",
      "**/*.d.ts",
      "**/bun.lockb",
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
      sourceType: "module",
      parserOptions: {
        project: path.join(process.cwd(), "tsconfig.json"),
        tsconfigRootDir: process.cwd(),
      },
    },
  },

  // JS/TS Presets
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // React & JSX Presets
  pluginReact.configs.flat.recommended,
  {
    plugins: {
      "react-compiler": reactCompiler,
      react: pluginReact,
    },
    rules: {
      "react-compiler/react-compiler": "error",
      "react/react-in-jsx-scope": "off",
      "react/jsx-sort-props": [
        "error",
        {
          callbacksLast: true,
          shorthandFirst: true,
          shorthandLast: false,
          ignoreCase: true,
          noSortAlphabetically: false,
          reservedFirst: true,
        },
      ],
    },
  },

  // JSX Accessibility Presets
  {
    files: ["**/*.{js,jsx,ts,tsx,mjs,cjs}"],
    ...jsxA11y.flatConfigs.recommended,
  },

  // SonarJS
  {
    ...sonarjs.configs.recommended,
    rules: {
      "sonarjs/prefer-read-only-props": "off",
    },
  },

  // Unused Imports
  {
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      "no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
    },
  },

  // Code Style and Formatting
  {
    rules: {
      "padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "import", next: "*" },
        { blankLine: "any", prev: "import", next: "import" },
        { blankLine: "always", prev: "*", next: "const" },
        { blankLine: "always", prev: "const", next: "*" },
        { blankLine: "always", prev: "*", next: "function" },
        { blankLine: "always", prev: "*", next: "class" },
        { blankLine: "always", prev: "*", next: "export" },
        { blankLine: "always", prev: "export", next: "*" },
        { blankLine: "always", prev: "*", next: "block-like" },
        { blankLine: "always", prev: "*", next: "return" },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: true,
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
];
