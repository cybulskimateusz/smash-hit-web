import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import pluginImport from 'eslint-plugin-import';
import pluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js, 'import': pluginImport, 'simple-import-sort': pluginSimpleImportSort },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser },
    rules:     {
      '@typescript-eslint/no-empty-object-type': 'off',
      // Allow intentionally unused vars/args if prefixed with "_"
      '@typescript-eslint/no-unused-vars': ['error', {
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
      }],
      'comma-spacing': ['error', { before: false, after: true }],
      'indent': ['error', 2],
      'max-len': ['error', { code: 120 }],
      'object-curly-newline': ['error', { consistent: true }],
      'object-curly-spacing': ['error', 'always'],
      // 'max-lines': ['error', { max: 60, skipBlankLines: true, skipComments: true }],
      'no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],
      'quotes': ['error', 'single', { avoidEscape: true }],
      'semi': ['error', 'always'],
      'import/prefer-default-export': 'error',
      'simple-import-sort/exports': 'warn',
      'simple-import-sort/imports': 'warn',
    },
  
  },
  tseslint.configs.recommended,
]);
