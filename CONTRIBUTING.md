# 贡献指南

感谢你对 Quiddity Website 项目的兴趣！本文档说明如何参与开发、提交代码以及解决冲突。

## 分支策略

| 分支                     | 用途                                  | 保护                  |
| ------------------------ | ------------------------------------- | --------------------- |
| `main`                   | 生产分支，仅接受 PR 合并              | 受保护，禁止直接 push |
| `refactor/v2`            | 当前重构主分支，所有开发基于此分支    | 受保护                |
| `feature/<scope>-<desc>` | 功能分支，如 `feature/nav-spec`       | 自由创建              |
| `fix/<scope>-<desc>`     | 修复分支，如 `fix/demo-return-button` | 自由创建              |
| `hotfix/<desc>`          | 紧急修复（直接基于 `main`）           | 合并后删除            |

### 创建分支示例

```bash
git checkout refactor/v2
git pull origin refactor/v2
git checkout -b feature/add-settings-panel
```

## Commit 规范

本项目遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

| 类型       | 用途                 | 示例                                            |
| ---------- | -------------------- | ----------------------------------------------- |
| `feat`     | 新功能               | `feat: 添加导航完整性 E2E 测试`                 |
| `fix`      | Bug 修复             | `fix: 修复 Demo 返回按钮无响应`                 |
| `refactor` | 重构（不改外部行为） | `refactor: 抽取 navigateToSection 到 scroll.ts` |
| `test`     | 测试相关             | `test: 增加 useVersion hook 单元测试`           |
| `docs`     | 文档                 | `docs: 重写 README`                             |
| `chore`    | 杂项（构建、依赖）   | `chore: 升级 vite 到 6.3.5`                     |
| `style`    | 格式调整             | `style: 统一缩进为 2 空格`                      |

### Commit 信息结构

```
<type>: <subject>

<body>  # 可选，详细说明
<footer>  # 可选，关联 issue 等
```

- **subject**：祈使句，首字母小写，不超过 50 字符
- **body**：每行不超过 72 字符，说明"为什么"而非"做了什么"
- **footer**：`Closes #123` / `BREAKING CHANGE: ...`

## PR 流程

1. **创建分支**：基于 `refactor/v2` 创建 `feature/*` 或 `fix/*` 分支
2. **本地验证**：提交前必须通过：
   ```bash
   npm run lint
   npm run check
   npm run test
   ```
3. **推送分支**：`git push -u origin feature/your-branch`
4. **创建 PR**：
   - 标题遵循 Conventional Commits
   - 描述包含：变更说明 / 测试方式 / 截图（UI 改动必须）
   - 关联相关 issue
5. **Review**：至少 1 个 reviewer 通过
6. **合并方式**：**Squash merge**（保持线性历史）
7. **删除分支**：合并后删除源分支

## 冲突解决

多人协作时冲突不可避免，遵循以下原则：

### 常规冲突

```bash
# 1. 拉取最新代码
git fetch origin
git checkout refactor/v2
git pull origin refactor/v2

# 2. 切回功能分支并 rebase
git checkout feature/your-branch
git rebase origin/refactor/v2

# 3. 解决冲突（编辑器会标记冲突文件）
#    解决后：
git add <冲突文件>
git rebase --continue

# 4. 强制推送（rebase 后需要）
git push --force-with-lease origin feature/your-branch
```

### 复杂冲突

- 冲突涉及多个核心文件时，**优先沟通协调**，避免独自大改共享文件
- 关键共享文件（修改前先通知团队）：
  - `src/lib/scroll.ts`（导航核心逻辑）
  - `src/components/Navbar.tsx`（顶部导航）
  - `src/App.tsx`（路由配置）
  - `src/store/i18n.ts`（国际化状态）
  - `package.json`（依赖版本）
- 同一文件多人在改时，建议拆分为更小的 PR

### 避免冲突的最佳实践

- **小步快跑**：每个 PR 控制在 300 行变更内
- **频繁同步**：每天开始工作前 `git pull origin refactor/v2`
- **短期分支**：feature 分支不超过 3 天
- **职责分离**：UI / 逻辑 / 测试 分别提交，便于 review

## 代码规范

### 强制执行

- **ESLint**：`npm run lint` 必须 0 错误
- **Prettier**：`npm run format` 自动格式化
- **TypeScript**：`npm run check` 必须通过
- **EditorConfig**：见 `.editorconfig`

### 类型严格

- 禁止 `any`，必要时用 `unknown` + 类型守卫
- 函数参数和返回值必须显式标注类型
- 优先用 `type` 而非 `interface`（除非需要 declaration merging）

### 命名约定

| 类型         | 风格        | 示例              |
| ------------ | ----------- | ----------------- |
| 组件         | PascalCase  | `HeroSection`     |
| 函数         | camelCase   | `scrollToSection` |
| 常量         | UPPER_SNAKE | `NAVBAR_HEIGHT`   |
| 类型         | PascalCase  | `VersionInfo`     |
| 文件（组件） | PascalCase  | `HeroSection.tsx` |
| 文件（工具） | kebab-case  | `nav-links.ts`    |

## 测试要求

### 单元测试（Vitest）

- **新功能必须附带单元测试**
- **Bug 修复必须附带回归测试**
- 测试文件位置：
  - 工具函数：`src/lib/__tests__/<name>.test.ts`
  - Hooks：`src/hooks/__tests__/<name>.test.ts`
  - Store：`tests/<name>.test.ts`
- 覆盖率门槛：`lines/functions/branches/statements ≥ 60%`

### E2E 测试（Playwright）

- 仅覆盖关键路径：导航 / 表单 / 核心交互
- 测试文件位置：`tests/e2e/<name>.spec.ts`
- 本地运行：`npm run test:e2e`（需先 build + preview）
- UI 调试模式：`npm run test:e2e:ui`

### 测试命名

- 用中文描述测试场景（与项目整体风格一致）
- 示例：`test("点击「功能特色」滚动到 #features", ...)`

## 本地开发环境

### 环境要求

- **Node.js** ≥ 20
- **npm** ≥ 10
- **操作系统**：Windows / macOS / Linux 均可

### 首次设置

```bash
git clone <repo-url>
cd quiddity-website
npm install
npx playwright install  # 安装浏览器用于 E2E 测试
```

### 日常开发

```bash
npm run dev          # 启动开发服务器（http://localhost:5173）
npm run lint         # 检查代码风格
npm run check        # TypeScript 类型检查
npm run test         # 运行单元测试
npm run test:e2e     # 运行 E2E 测试（自动 build + preview）
```

### 构建相关说明

`npm run build` 会触发 `prebuild` hook，调用 `sync:downloads` 同步 GitHub Releases。若仓库无 Release，构建会失败。**CI 和 E2E 测试使用 `npx vite build` 绕过此 hook**。本地构建如遇此问题，也可直接用 `npx vite build`。

## 问题反馈

- Bug 报告：创建 issue，使用 bug 模板
- 功能建议：创建 issue，标记为 `enhancement`
- 安全问题：私信维护者，勿公开 issue

## 许可证

提交代码即表示你同意将代码以项目许可证（见 `/legal` 页面）发布。
