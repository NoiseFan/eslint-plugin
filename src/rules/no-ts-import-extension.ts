import type { Rule as ESLintRule } from 'eslint'

export const noTsImportExtension: ESLintRule.RuleModule = {
  meta: {
    type: 'suggestion',
    fixable: 'code',
    schema: [],
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        const source = node.source?.value
        if (typeof source !== 'string' || !source.endsWith('.ts'))
          return

        const nextPath = source.slice(0, -'.ts'.length)

        context.report({
          node: node.source,
          message: 'Do not include the .ts extension in import paths.',
          fix: fixer => fixer.replaceText(node.source, `'${nextPath}'`),
        })
      },
    }
  },
}
