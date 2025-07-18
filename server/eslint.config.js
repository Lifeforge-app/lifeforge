import js from "@eslint/js";
import unusedImports from "eslint-plugin-unused-imports";
import { defineConfig } from "eslint/config";
import globals from "globals";
import path from "node:path";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: { globals: globals.node },
  },
  {
    files: ["**/*.{ts,tsx,js,jsx,mjs,cjs}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: path.resolve(process.cwd(), "tsconfig.json"), // or "./tsconfig.json"
        tsconfigRootDir: process.cwd(), // 👈 这里是重点
        sourceType: "module",
      },
    },
  },
  tseslint.configs.recommended,
  {
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      "no-unused-vars": "off", // or "@typescript-eslint/no-unused-vars": "off",
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
  {
    rules: {
      "padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "*", next: "export" },
        { blankLine: "always", prev: "export", next: "*" },
        { blankLine: "always", prev: "*", next: "const" },
        { blankLine: "always", prev: "const", next: "*" },
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
]);
