import type { Rule as ESLintRule } from 'eslint'

/**
 * Require a line break before the first property in long object expressions.
 * Objects with three or fewer properties,
 * or 140 characters or fewer are left untouched.
 */
export const objectExpressionNewline: ESLintRule.RuleModule = {
  meta: {
    type: 'suggestion',
    fixable: 'code',
    schema: [],
  },
  create(context) {
    const { sourceCode } = context

    return {
      ObjectExpression(node) {
        if (node.properties.length <= 3 || !node.range)
          return

        if (sourceCode.text.slice(node.range[0], node.range[1]).length <= 140)
          return

        const firstProperty = node.properties[0]
        if (!firstProperty?.range)
          return

        if (sourceCode.text.slice(node.range[0] + 1, firstProperty.range[0]).includes('\n'))
          return

        context.report({
          node,
          message: 'Add a line break before the first property of a long object expression.',
          fix: fixer => fixer.insertTextBefore(firstProperty, '\n'),
        })
      },
    }
  },
}
