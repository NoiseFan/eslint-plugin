import type { ExpectedDiagnostic } from './types'
import fs from 'node:fs/promises'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ESLint } from 'eslint'
import { describe, expect, it } from 'vitest'
import noisefan from '../src'
import diagnostics from './fixtures/diagnostics.json'

const packageRoot = fileURLToPath(new URL('..', import.meta.url))
const input = join(packageRoot, 'tests/fixtures/input')
const output = join(packageRoot, 'tests/fixtures/output')
const expectedDiagnostics: Record<string, ExpectedDiagnostic[]> = diagnostics

async function listFiles(directory: string): Promise<string[]> {
  return (await fs.readdir(directory, { recursive: true, withFileTypes: true }))
    .filter(entry => entry.isFile())
    .map(entry => relative(directory, join(entry.parentPath, entry.name)))
    .sort()
}

describe('fixtures', () => {
  it('has matching input and output files for every rule', async () => {
    const inputFiles = await listFiles(input)
    expect(inputFiles.length).toBeGreaterThan(0)
    expect(await listFiles(output)).toEqual(inputFiles)
    expect([...new Set(inputFiles.map(file => file.split('/')[0]))].sort())
      .toEqual(Object.keys(noisefan.rules).sort())
  })

  it('runs the all preset against real files and preserves stable fixes', async () => {
    const target = await fs.mkdtemp(join(packageRoot, 'tests/_fixtures-'))
    try {
      await fs.cp(input, target, { recursive: true })
      const eslint = new ESLint({
        cwd: target,
        fix: true,
        overrideConfigFile: true,
        overrideConfig: noisefan.configs.all,
      })
      const results = await eslint.lintFiles(['**/*.{js,ts,vue,html,css,scss}'])
      expect(results.map(result => relative(target, result.filePath)).sort()).toEqual(await listFiles(input))
      await ESLint.outputFixes(results)

      for (const result of results) {
        const file = relative(target, result.filePath)
        expect.soft(result.fatalErrorCount, file).toBe(0)
        expect.soft(result.messages.map(({ ruleId, message }) => ({ ruleId, message })), file)
          .toEqual(expectedDiagnostics[file] ?? [])
        const fixed = await fs.readFile(result.filePath, 'utf8')
        await expect.soft(fixed).toMatchFileSnapshot(join(output, file))
      }

      for (const result of await eslint.lintFiles(['**/*.{js,ts,vue,html,css,scss}'])) {
        const file = relative(target, result.filePath)
        expect.soft(result.fatalErrorCount, file).toBe(0)
        expect.soft(result.messages.map(({ ruleId, message }) => ({ ruleId, message })), file)
          .toEqual(expectedDiagnostics[file] ?? [])
        expect.soft(result.output, file).toBeUndefined()
      }
    }
    finally {
      await fs.rm(target, { recursive: true, force: true })
    }
  })
})
