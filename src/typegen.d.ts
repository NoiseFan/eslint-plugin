/* eslint-disable */
/* prettier-ignore */
import type { Linter } from 'eslint'

export interface RuleOptions {
  /**
   * Put each attribute on its own line when a tag exceeds the configured attribute limit.
   */
  'noisefan/html-attribute-newline'?: Linter.RuleEntry<NoisefanHtmlAttributeNewline>
  /**
   * Require a line break between adjacent HTML tags.
   */
  'noisefan/html-tag-newline'?: Linter.RuleEntry<[]>
  'noisefan/no-ref'?: Linter.RuleEntry<[]>
  /**
   * Use @/ aliases for imports from src in source and test files.
   */
  'noisefan/no-relative-src-import'?: Linter.RuleEntry<[]>
  'noisefan/no-ts-import-extension'?: Linter.RuleEntry<[]>
  'noisefan/object-expression-newline'?: Linter.RuleEntry<[]>
  /**
   * Convert CSS px dimensions to rem using a 16px base.
   */
  'noisefan/px-to-rem'?: Linter.RuleEntry<[]>
}

/* ======= Declarations ======= */
// ----- noisefan/html-attribute-newline -----
type NoisefanHtmlAttributeNewline = []|[{
  maxAttributes?: number
}]