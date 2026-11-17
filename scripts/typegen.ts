import fs from 'node:fs/promises'
import { flatConfigsToRulesDTS } from 'eslint-typegen/core'
import plugin from '../src'

// Export option-aware types without augmenting ESLint's global rule registry.
const moduleAugmentation = `declare module 'eslint' {
  namespace Linter {
    interface RulesRecord extends RuleOptions {}
  }
}

`
const dts = (await flatConfigsToRulesDTS(plugin.configs.all)).replace(moduleAugmentation, '')

await fs.writeFile(new URL('../src/typegen.d.ts', import.meta.url), dts)
