# Quiddity Website

> Quiddity AI 桌面应用官方网站 — 多模型 AI 桌面应用

[![CI](https://github.com/jiuan-9/quiddity-website/actions/workflows/ci.yml/badge.svg)](https://github.com/jiuan-9/quiddity-website/actions/workflows/ci.yml)

## 技术栈

- **框架**：React 18.3 + TypeScript 5.8 + Vite 6.3
- **样式**：Tailwind CSS 3.4
- **动画**：Framer Motion 11
- **路由**：React Router 7 (HashRouter)
- **状态**：Zustand 5
- **测试**：Vitest 2 + Playwright 1.61
- **国际化**：中英双语（自定义 store，无第三方 i18n 库）

## 快速开始

### 环境要求

- Node.js ≥ 20
- npm ≥ 10

### 安装

```bash
git clone https://github.com/jiuan-9/quiddity-website.git
cd quiddity-website
npm install
npx playwright install  # 可选：安装 E2E 浏览器
```

### 开发

```bash
npm run dev  # 启动开发服务器 http://localhost:5173
```

### 构建

```bash
npm run build  # tsc -b && vite build（含 prebuild 同步 Release）
npx vite build  # 仅构建（绕过 prebuild，CI 友好）
```

> **注意**：`npm run build` 的 `prebuild` hook 会调用 `sync:downloads` 拉取 GitHub Releases。若仓库无 Release 会失败，此时可用 `npx vite build` 绕过。

### 预览

```bash
npm run preview  # 预览构建产物 http://localhost:4173
```

## 测试

### 单元测试（Vitest + jsdom）

```bash
npm run test          # 运行一次
npm run test:watch    # 监听模式
npm run test:coverage # 覆盖率报告
```

### E2E 测试（Playwright）

```bash
npm run test:e2e      # 5 个浏览器项目（chromium/firefox/webkit/mobile-chrome/mobile-safari）
npm run test:e2e:ui   # UI 调试模式
npx playwright test --project=chromium  # 仅 chromium（快速验证）
```

E2E 测试覆盖 17 个导航场景，详见 [`tests/e2e/navigation.spec.ts`](./tests/e2e/navigation.spec.ts)。

## 代码质量

```bash
npm run check         # TypeScript 类型检查
npm run lint          # ESLint
npm run lint:fix      # ESLint 自动修复
npm run format        # Prettier 格式化
npm run format:check  # Prettier 检查
```

## 项目结构

```
quiddity-website/
├── .github/workflows/    # CI/CD 配置
│   ├── ci.yml            # 主 CI（lint + test + build + e2e）
│   └── check-links.yml   # 下载链接巡检
├── public/               # 静态资源（version.json / downloads.json / announcements.json）
├── scripts/              # 构建辅助脚本（sync-downloads / sync-version / prebuild）
├── src/
│   ├── components/       # 可复用组件
│   │   ├── animation/    # 动画组件（ShaderGradient / AuroraBackground / TextSplit 等）
│   │   ├── demo/         # Demo 页专用组件（ChatMessage / CodeBlock 等）
│   │   ├── ui/           # 基础 UI（Button 等）
│   │   ├── Navbar.tsx    # 顶部导航
│   │   ├── Footer.tsx    # 页脚
│   │   ├── Hero.tsx      # 首屏主视觉
│   │   └── ...
│   ├── content/          # 内容数据（nav-links / footer-links / hero 等）
│   ├── hooks/            # 自定义 Hooks（useVersion / useChat / useI18n 等）
│   ├── lib/              # 工具函数（scroll / perf / animation 等）
│   ├── pages/            # 路由页面
│   │   ├── Home.tsx      # 首页
│   │   ├── Demo.tsx      # 在线体验
│   │   ├── Timeline.tsx  # 版本历程
│   │   ├── Announcements.tsx
│   │   ├── NotFound.tsx  # 404
│   │   └── legal/        # 法律信息
│   ├── store/            # Zustand stores（i18n 等）
│   ├── styles/           # 全局样式
│   ├── types/            # TypeScript 类型定义
│   ├── App.tsx           # 路由配置
│   └── main.tsx          # 入口
├── tests/
│   ├── e2e/              # Playwright E2E 测试
│   ├── setup.ts          # Vitest 全局 mock（IntersectionObserver / matchMedia 等）
│   ├── smoke.test.ts     # 基础设施冒烟测试
│   └── ...
├── playwright.config.ts  # Playwright 配置（5 浏览器项目）
├── vitest.config.ts      # Vitest 配置（jsdom + coverage）
├── tailwind.config.ts    # Tailwind 主题配置
└── package.json
```

## 管理后台

网站不再提供 `/admin` 页面。公告管理、GitHub 数据查看与一键部署已迁移到独立的桌面应用：

```
D:\Quiddity-Agent\管理后台\
├── main.py           # CustomTkinter 桌面应用入口
├── start.bat         # Windows 启动脚本
├── config_store.py   # 本地配置持久化
├── github_client.py  # GitHub API 封装
├── announcements.py  # 公告增删查改
├── deployer.py       # 部署流程封装
└── requirements.txt  # Python 依赖
```

启动方式：

```bash
cd "D:\Quiddity-Agent\管理后台"
pip install -r requirements.txt
python main.py
# 或双击 start.bat
```

## 关键特性

### 导航系统

所有导航元素统一使用 `<button>`（非 `<a href="#">`），避免 HashRouter 下 hash 变化触发意外路由。核心逻辑在 [`src/lib/scroll.ts`](./src/lib/scroll.ts)：

- `scrollToSection(id)`：同页平滑滚动，减去 Navbar 高度
- `navigateToSection(href, navigate, pathname)`：统一处理同页锚点 / 跨路由锚点 / 路由跳转
  - 跨路由场景下 `navigate("/")` 后用 5 次重试（50/100/200/400/800ms）等待 lazy chunk 加载

### 版本管理

- [`public/version.json`](./public/version.json)：版本信息（由 `sync:version` 脚本从 GitHub Release 同步）
- [`useVersion`](./src/hooks/useVersion.ts) hook：内存缓存 + DEFAULT_VERSION fallback
- 网站所有版本号统一从 `useVersion` 读取，避免硬编码

### 国际化

- 中英双语，自定义 Zustand store（[`src/store/i18n.ts`](./src/store/i18n.ts)）
- 切换语言时同步更新 `<html lang>` 和 URL 参数
- 内容文件用 `{ zh, en }` 结构，通过 `t()` 函数按当前语言返回

### 性能优化

- 所有页面 `lazy` 加载
- ShaderGradient 根据 `getDevicePerformanceProfile` 分级渲染
- 移动端自动降级（AuroraBackground 替代 ShaderGradient）
- 图片懒加载 + `image-rendering: pixelated`（仅图片）

## 贡献

请阅读 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解开发流程、分支策略、commit 规范和冲突解决。

## 法律信息

本项目涉及多国法规，详见 [/legal](https://jiuan-9.github.io/quiddity-website/#/legal) 页面。

## 相关仓库

- [Quiddity Agent](https://github.com/jiuan-9/quiddity-agent) — 桌面应用主仓库
