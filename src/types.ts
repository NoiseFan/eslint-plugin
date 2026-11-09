import type { ESLint, Linter, Rule } from 'eslint'
import type { AST } from 'vue-eslint-parser'

export interface NoisefanPlugin extends ESLint.Plugin {
  rules: Record<string, Rule.RuleModule>
  configs: {
    all: Linter.Config[]
  }
}

export interface HtmlAttributeNewlineOptions {
  maxAttributes?: number
}

export interface DocumentParserServices {
  defineDocumentVisitor: (visitor: { VStartTag: (node: AST.VStartTag) => void }) => ReturnType<Rule.RuleModule['create']>
}

export interface AttributeGap {
  range: [number, number]
  replacement: string
}
