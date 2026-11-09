import type { Linter } from 'eslint'
import type { NoisefanPlugin } from './types'
import * as vueParser from 'vue-eslint-parser'
import { name, version } from '../package.json'
import { htmlAttrNewline } from './rules/html-attr-newline'
import { htmlTagNewline } from './rules/html-tag-newline'
import { noRef } from './rules/no-ref'
import { noRelativeSrcImport } from './rules/no-relative-src-import'
import { noTsImportExtension } from './rules/no-ts-import-extension'
import { objectExpressionNewline } from './rules/object-expression-newline'
import { pxToRem } from './rules/px-to-rem'
import { textParser } from './text-parser'

const noisefan: NoisefanPlugin = {
  meta: { name, version, namespace: 'noisefan' },
  rules: {
    'no-ts-import-extension': noTsImportExtension,
    'object-expression-newline': objectExpressionNewline,
    'px-to-rem': pxToRem,
    'no-ref': noRef,
    'no-relative-src-import': noRelativeSrcImport,
    'html-tag-newline': htmlTagNewline,
    'html-attribute-newline': htmlAttrNewline,
  },
  configs: { all: [] },
}

const all: Linter.Config[] = [
  {
    name: 'noisefan/setup',
    plugins: { noisefan },
  },
  {
    name: 'noisefan/javascript',
    files: ['**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx,vue}'],
    rules: {
      'noisefan/no-ref': 'error',
      'noisefan/object-expression-newline': 'error',
      'noisefan/html-tag-newline': 'error',
    },
  },
  {
    name: 'noisefan/typescript-imports',
    files: ['**/*.ts'],
    ignores: ['**/*.config.ts'],
    rules: { 'noisefan/no-ts-import-extension': 'error' },
  },
  {
    name: 'noisefan/src-imports',
    files: ['**/*.{ts,vue}'],
    rules: { 'noisefan/no-relative-src-import': 'error' },
  },
  {
    name: 'noisefan/vue',
    files: ['**/*.vue'],
    languageOptions: { parser: vueParser },
    rules: {
      'noisefan/html-attribute-newline': 'error',
      'noisefan/px-to-rem': 'error',
    },
  },
  {
    name: 'noisefan/html',
    files: ['**/*.html'],
    languageOptions: {
      parser: vueParser,
      parserOptions: { parser: false },
    },
    rules: {
      'noisefan/html-attribute-newline': 'error',
      'noisefan/html-tag-newline': 'error',
    },
  },
  {
    name: 'noisefan/stylesheets',
    files: ['**/*.{css,scss}'],
    languageOptions: { parser: textParser },
    rules: { 'noisefan/px-to-rem': 'error' },
  },
]

noisefan.configs.all = all

export { all }
export type { NoisefanPlugin } from './types'
export default noisefan
