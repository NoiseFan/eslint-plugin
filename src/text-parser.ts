import type { Linter } from 'eslint'
import { version } from '../package.json'

// The px-to-rem rule only needs raw text. This parser does not validate CSS syntax.
export const textParser: Linter.Parser = {
  meta: { name: 'noisefan/text-parser', version },
  parse(text) {
    const lines = text.split(/\r\n|[\r\n\u2028\u2029]/u)
    return {
      type: 'Program',
      sourceType: 'module',
      body: [],
      tokens: [],
      comments: [],
      range: [0, text.length],
      loc: {
        start: { line: 1, column: 0 },
        end: { line: lines.length, column: lines.at(-1)?.length ?? 0 },
      },
    }
  },
}
