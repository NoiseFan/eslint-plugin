# @noisefan/eslint-plugin

noisefan 的个人 ESLint 规则集合，配合 `@antfu/eslint-config` 使用。支持 ESLint 9 / 10 的 flat config，仅提供 ESM。

## 安装

```bash
pnpm add -D eslint @antfu/eslint-config @noisefan/eslint-plugin
```

要求 Node.js `^20.19.0 || ^22.13.0 || >=24`。

## 配合 antfu 使用

```js
// eslint.config.js
import antfu from '@antfu/eslint-config'
import noisefan from '@noisefan/eslint-plugin'

export default antfu({
  typescript: true,
  vue: true,
}, ...noisefan.configs.all)
```

`configs.all` 启用全部个人规则，并为 Vue、HTML 和样式文件设置对应的解析器。TypeScript / TSX 的解析器由 antfu 配置提供；Vue 中的 TypeScript 也沿用 antfu 的解析器选项。

在配置末尾添加 `rules` 即可覆盖默认规则，例如 `rules: { 'noisefan/no-ref': 'off' }`。

## 规则

规则统一使用 `noisefan/` 前缀，除 `no-ref` 外均支持自动修复。

| 规则 | 行为 |
| --- | --- |
| `no-ts-import-extension` | 移除 TS 静态导入路径末尾的 `.ts`，跳过 `*.config.ts` |
| `no-relative-src-import` | 将 TS、Vue 中指向 `src` 内现有文件的 `../` 静态导入改为 `@/` 路径 |
| `object-expression-newline` | 对超过 3 个属性且超过 140 个字符的对象，在首个属性前换行 |
| `no-ref` | 限制直接调用 `ref()` 和 `readonly()`，提示使用浅层或深层替代函数 |
| `html-tag-newline` | 在相邻的闭合标签和开始标签之间换行 |
| `html-attribute-newline` | Vue、HTML 中属性超过 2 个时，将属性、结束括号及单独的插值内容分行 |
| `px-to-rem` | Vue、CSS、SCSS 中以 16px 为基准转换绝对值大于等于 10px 的尺寸 |

`no-relative-src-import` 要求项目已配置 `@/` 指向 `src/`；`no-ts-import-extension` 要求构建环境允许省略 `.ts` 扩展名。`html-attribute-newline` 可通过 `maxAttributes` 调整阈值。

## License

[MIT](./LICENSE)
