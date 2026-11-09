import type { Rule as ESLintRule } from 'eslint'

export const htmlTagNewline: ESLintRule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: { description: 'Require a line break between adjacent HTML tags.' },
    fixable: 'code',
    schema: [],
  },
  create(context) {
    return {
      Program(node) {
        const { text } = context.sourceCode
        const pattern = /<\/([\w:-]+)>[\t ]*<([\w:-]+)(?=[\t\n\r />])/g

        for (const match of text.matchAll(pattern)) {
          const [matchedTags, closingTagName] = match
          const matchOffset = match.index
          const closingTagEnd = matchOffset + `</${closingTagName}>`.length

          if (/[\r\n]/.test(matchedTags))
            continue

          context.report({
            node,
            message: 'Add a line break between adjacent HTML tags.',
            fix: fixer => fixer.replaceTextRange(
              [closingTagEnd, matchOffset + matchedTags.length],
              `\n${matchedTags.slice(matchedTags.lastIndexOf('<'))}`,
            ),
          })
        }
      },
    }
  },
}
