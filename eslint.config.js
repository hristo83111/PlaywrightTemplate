import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import playwright from 'eslint-plugin-playwright'
import prettier from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

export default tseslint.config(
  js.configs.recommended, // ESLint recommended rules
  tseslint.configs.recommended, // TypeScript recommended rules
  prettierConfig, // Disable conflicting ESLint rules
  {
    files: ['**/*.ts'], // Apply these rules only to TypeScript files
    languageOptions: {
      parser: tseslint.parser,
      sourceType: 'module',
      globals: {
        console: 'readonly', // Fix "console is not defined"
        Buffer: 'readonly', // Prevents ESLint from flagging Buffer as undefined
        process: 'readonly' // Prevents ESLint from flagging `process` as undefined
      }
    },
    plugins: {
      playwright,
      prettier // Enable Prettier
    },
    rules: {
      // TypeScript-specific rules
      'no-console': 'off',
      'no-unused-vars': 'off', // Temporarily disable to check if this is causing the issue
      '@typescript-eslint/no-explicit-any': 'error',

      // Playwright-specific rules
      'playwright/no-skipped-test': 'warn',
      'playwright/no-standalone-expect': 'error',
      'playwright/no-wait-for-timeout': 'warn',

      // Prettier rules
      'prettier/prettier': 'error' // Enforce Prettier formatting
    }
  }
)
