import antfu from '@antfu/eslint-config'
import { ESLint } from 'eslint'
import { describe, expect, it } from 'vitest'
import noisefan from '../src'

const eslint = new ESLint({
  fix: true,
  overrideConfigFile: true,
  overrideConfig: noisefan.configs.all,
})

describe('noisefan plugin', () => {
  it('exposes seven rules under one plugin', () => {
    expect(noisefan.meta?.name).toBe('@noisefan/eslint-plugin')
    expect(Object.keys(noisefan.rules)).toHaveLength(7)
  })

  it('reports restricted calls using the noisefan namespace', async () => {
    const [result] = await eslint.lintText('ref(0); readonly({})', { filePath: 'example.js' })
    expect(result?.messages.map(message => message.ruleId)).toEqual([
      'noisefan/no-ref',
      'noisefan/no-ref',
    ])
  })

  it('keeps explicit TypeScript extensions in config files', async () => {
    const [result] = await eslint.lintText('import config from \'./config.ts\'', { filePath: 'example.config.ts' })
    expect(result?.messages).toEqual([])
    expect(result?.output).toBeUndefined()
  })

  it('accepts attribute threshold overrides', async () => {
    const custom = new ESLint({
      fix: true,
      overrideConfigFile: true,
      overrideConfig: [
        ...noisefan.configs.all,
        { rules: { 'noisefan/html-attribute-newline': ['error', { maxAttributes: 1 }] } },
      ],
    })
    const [result] = await custom.lintText('<input disabled required>', { filePath: 'example.html' })
    expect(result?.messages).toEqual([])
    expect(result?.output).toBe('<input\n  disabled\n  required\n>')
  })

  it.each(['example.css', 'example.scss'])('converts dimensions in %s without changing strings, URLs or comments', async (filePath) => {
    const source = '.box { padding: 16px 8px; margin: -32px; content: "16px"; background: url(16px.png); /* 32px */ }'
    const [result] = await eslint.lintText(source, { filePath })
    expect(result?.messages).toEqual([])
    expect(result?.output).toBe('.box { padding: 1rem 8px; margin: -2rem; content: "16px"; background: url(16px.png); /* 32px */ }')
  })

  it('composes with antfu for TypeScript and Vue TypeScript', async () => {
    const combined = new ESLint({
      overrideConfigFile: true,
      overrideConfig: await antfu({ typescript: true, vue: true }, ...noisefan.configs.all),
    })
    for (const [filePath, source] of [
      ['example.ts', 'const count: number = ref(0)\n'],
      ['example.vue', '<script setup lang="ts">\nconst count: number = ref(0)\n</script>\n'],
    ]) {
      const [result] = await combined.lintText(source, { filePath })
      expect(result?.fatalErrorCount).toBe(0)
      expect(result?.messages.some(message => message.ruleId === 'noisefan/no-ref')).toBe(true)
    }
  })
})
