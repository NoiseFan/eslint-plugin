# @noisefan/eslint-plugin

noisefan 的个人 ESLint 规则集合，配合 `@antfu/eslint-config` 使用。支持 ESLint 9 / 10 的 flat config，仅提供 ESM。

## 安装

```bash
pnpm add -D eslint @antfu/eslint-config @noisefan/eslint-plugin
```

要求 Node.js `^20.19.0 || ^22.13.0 || >=24`。首次发布前，可在本地执行 `pnpm pack`，再在目标项目安装生成的 `.tgz` 文件。

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

这些规则体现个人偏好，请按项目需要关闭或调整。自定义配置放在最后：

```js
import antfu from '@antfu/eslint-config'
import noisefan from '@noisefan/eslint-plugin'

export default antfu({
  typescript: true,
  vue: true,
}, ...noisefan.configs.all, {
  rules: {
    'noisefan/no-ref': 'off',
    'noisefan/html-attribute-newline': ['error', { maxAttributes: 3 }],
  },
})
```

也可以只注册插件，手动启用需要的规则：

```js
import antfu from '@antfu/eslint-config'
import noisefan from '@noisefan/eslint-plugin'

export default antfu({}, {
  plugins: { noisefan },
  rules: {
    'noisefan/no-ref': 'warn',
  },
})
```

## 规则

所有规则都使用 `noisefan/` 前缀。下面是 `configs.all` 的默认作用范围：

| 规则 | 行为 | 文件 | 自动修复 |
| --- | --- | --- | --- |
| `no-ts-import-extension` | 移除静态导入路径末尾的 `.ts`，跳过 `*.config.ts` | TS | 是 |
| `no-relative-src-import` | 将可解析到 `src` 内现有文件的 `../` 静态导入改为 `@/` 路径 | TS、Vue | 是 |
| `object-expression-newline` | 对超过 3 个属性且超过 140 个字符的对象，在首个属性前换行 | JS、TS、Vue | 是 |
| `no-ref` | 限制直接调用 `ref()` 和 `readonly()`，提示使用浅层或深层替代函数 | JS、TS、Vue | 否 |
| `html-tag-newline` | 在相邻的闭合标签和开始标签之间换行 | JS、TS、Vue、HTML | 是 |
| `html-attribute-newline` | 属性数量超过阈值时，将属性、结束括号及单独的插值内容分行 | Vue、HTML | 是 |
| `px-to-rem` | 以 16px 为基准转换绝对值大于等于 10px 的尺寸，跳过字符串、注释和 URL | Vue、CSS、SCSS | 是 |

`html-attribute-newline` 的 `maxAttributes` 默认为 `2`，可设为大于等于 `0` 的整数。

`no-relative-src-import` 要求项目已将 `@/` 配置为对应的 `src/` 路径；`no-ts-import-extension` 适用于允许省略 `.ts` 扩展名的构建环境。`no-ref` 按函数名称检查，不判断导入来源。`html-tag-newline` 按源码文本匹配标签，也可能匹配字符串中的标签。

CSS / SCSS 使用仅提供源码文本的解析器，用于执行 `px-to-rem`，不提供样式语法校验，也不与其他 CSS language 插件共享解析器。Vue 的转换同样基于原始源码文本。

## 集成测试

`tests/fixtures/input/` 按规则存放输入，`tests/fixtures/output/` 存放对应的完整预期文件，覆盖全部 7 条规则。`tests/fixtures/diagnostics.json` 记录无法自动修复的预期诊断。

测试将输入复制到临时目录，通过真实的 `ESLint.lintFiles()` 执行 `configs.all`，写入自动修复结果并逐文件比较预期输出；再次执行时要求输出保持稳定。临时目录会在测试结束后清理。另有 antfu 与 TypeScript / Vue TypeScript 的组合测试。

```bash
pnpm test run tests/fixtures.test.ts
```

## 本地开发

使用 `package.json` 中指定的 pnpm 版本。安装依赖时，`prepare` 会配置 git hooks，提交前通过 `lint-staged` 对暂存文件执行 ESLint 自动修复。

| 命令 | 用途 |
| --- | --- |
| `pnpm install` | 安装依赖并配置 git hooks |
| `pnpm lint` / `pnpm lint:fix` | 检查或修复代码风格 |
| `pnpm test` | 以 watch 模式运行测试 |
| `pnpm test --run` | 运行全部测试一次 |
| `pnpm test:fixtures` | 运行 input/output 集成测试 |
| `pnpm test:cov --run` | 运行测试并生成覆盖率报告 |
| `pnpm typecheck` | 检查源码、测试和脚本类型 |
| `pnpm build` / `pnpm dev` | 构建或监听构建 |
| `pnpm check` | 依次运行 lint、类型检查、测试、构建和 publint |
| `pnpm pack` | 构建并生成本地 `.tgz` 安装包 |
| `pnpm publish:ci --dry-run` | 演练发包，检查实际包内容，不上传 npm |
| `pnpm release` | 完整检查后通过 bumpp 升版本、提交、创建 tag 并推送 |
| `pnpm publish:ci` | 按当前版本选择 npm dist-tag 并发布 |

构建产物和类型声明输出到 `dist/`；`prepack` 会在打包或发布前自动构建。覆盖率报告输出到 `coverage/`，包括终端摘要、HTML 和 Clover XML。

## CI 和发包

GitHub 仓库地址为 `noisefan/eslint-plugin`。

`.github/workflows/ci.yml` 在分支推送和 PR 中分别运行 Lint、类型检查与构建、测试与覆盖率，并保存 Clover 覆盖率报告。构建任务还会执行 publint 和发布演练。`.github/workflows/autofix.yml` 在 PR 中运行 `pnpm lint:fix`，再由 autofix.ci 回写格式修复。CI 使用 `pnpm install --frozen-lockfile`。

`.github/workflows/publish.yml` 由 `v*` tag 触发，先执行 `pnpm check`，再通过 npm OIDC 发布包，成功后使用 GitHub 自动生成的 release notes 创建 Release。发布脚本要求 tag 与 `package.json` 中的版本完全一致。

首次发布前，确认 npm 账号有 `@noisefan` scope 的发布权限，并将代码推送到对应的公开 GitHub 仓库。新包可先通过 `npm login` 和 `pnpm publish:ci` 在本地完成首次发布。随后在 npm 包设置中配置 [Trusted Publisher](https://docs.npmjs.com/trusted-publishers/)：填写实际 GitHub owner、仓库名 `eslint-plugin` 和工作流文件名 `publish.yml`，允许直接执行 `npm publish`。`repository.url` 必须与实际 GitHub 仓库一致。

后续执行 `pnpm release`，确认 bumpp 的目标版本后，推送的 tag 会触发自动发布。版本对应的 npm dist-tag 如下：

| 版本示例 | npm dist-tag |
| --- | --- |
| `1.0.0` | `latest` |
| `1.1.0-alpha.1` | `alpha` |
| `1.1.0-beta.1` | `beta` |
| `1.1.0-rc.1` | `rc` |
| `1.1.0-0` | `next` |

发布工作流使用 GitHub 托管 runner、Node.js 24 和 `id-token: write`。npm OIDC 要求 npm CLI 版本至少为 `11.5.1`，详细要求以 [npm 官方文档](https://docs.npmjs.com/trusted-publishers/) 为准。

## License

[MIT](./LICENSE)
