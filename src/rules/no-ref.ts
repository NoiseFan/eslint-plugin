import type { Rule as ESLintRule } from 'eslint'

export const noRef: ESLintRule.RuleModule = {
  meta: {
    type: 'suggestion',
    schema: [],
  },
  create(context) {
    return {
      CallExpression(node) {
        if (node.callee.type === 'Identifier') {
          if (node.callee.name === 'ref') {
            context.report({
              node,
              message: 'Usage of ref() is restricted. Use shallowRef() or deepRef() instead.',
            })
          }
          else if (node.callee.name === 'readonly') {
            context.report({
              node,
              message: 'Usage of readonly() is restricted. Use shallowReadonly() or deepReadonly() instead.',
            })
          }
        }
      },
    }
  },
}
