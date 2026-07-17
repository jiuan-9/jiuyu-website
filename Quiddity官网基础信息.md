# Quiddity官网基础信息

## 项目概述

Quiddity是一款 Electron 桌面 AI 聊天应用，本项目为其官方品牌网站，用于展示产品特色、引导用户下载。

- **官网地址**：https://jiuan-9.github.io/quiddity-website/
- **GitHub 仓库**：https://github.com/jiuan-9/quiddity-website
- **联系邮箱**：jiu0919@agent.qq.com

---

## Quiddity桌面应用信息

| 项目 | 详情 |
|------|------|
| 版本 | v1.0.0 |
| 平台 | Windows（macOS 待推出） |
| 技术栈 | Electron + Node.js |
| 应用位置 | `d:\Quiddity\` |
| 安装包位置 | `d:\Quiddity\dist\Quiddity 1.0.0.exe`（约 69MB） |
| 下载地址 | https://github.com/jiuan-9/quiddity-website/releases/download/v1.0.0/Quiddity-1.0.0.exe |

### 应用核心功能

- **11 家内置服务商**：阿里云(通义千问)、百度(文心一言)、硅基流动、阶跃星辰、科大讯飞(星火)、MiniMax(海螺AI)、DeepSeek、腾讯(混元)、月之暗面(Kimi)、字节跳动(豆包)、智谱(GLM)
- **62 个内置模型**：覆盖上述所有服务商
- **AI 人设精调**：自定义 AI 名字、性格、外貌、说话方式，精调引擎自动编译为最佳提示词
- **多会话管理**：无限创建会话，支持置顶、搜索、重命名、右键菜单
- **本地加密存储**：对话记录和 API 密钥加密保存在本地，不上传任何服务器
- **深色/亮色双主题**：平滑过渡动画
- **Markdown 渲染**：代码高亮、表格、列表完整支持
- **图片上传**：支持粘贴、拖入、点选图片（Vision 模式）
- **对话导入/导出**：Markdown 格式
- **人设模板导入/导出**：JSON 格式

---

## 官网技术信息

| 项目 | 详情 |
|------|------|
| 框架 | React 18 + TypeScript |
| 样式 | Tailwind CSS 3 |
| 构建工具 | Vite |
| 图标库 | lucide-react |
| 路由 | react-router-dom（HashRouter，单页） |
| 工作目录 | `d:\Quiddity官网\` |
| 开发命令 | `npm run dev` |
| 构建命令 | `npm run build` |
| 类型检查 | `npm run check` |

### 构建输出

- 构建产物输出到 `docs/` 目录
- GitHub Pages 直接从 `main` 分支 `/docs` 目录部署
- 基础路径：`/quiddity-website/`

---

## 网站结构

```
src/
├── components/
│   ├── Navbar.tsx          # 顶部导航栏（固定，滚动变色）
│   ├── Hero.tsx            # 首屏区域（动态渐变背景、大标题、CTA）
│   ├── Features.tsx        # 6 张功能特色卡片
│   ├── Stats.tsx           # 数据统计（数字滚动动画）
│   ├── Preview.tsx         # 界面预览（模拟窗口截图）
│   ├── Download.tsx        # 下载引导区（Windows/macOS）
│   ├── Footer.tsx          # 页脚（品牌信息、链接、版权）
│   ├── CountUp.tsx         # 数字滚动动画组件
│   ├── ScrollReveal.tsx    # 滚动触发淡入动画
│   └── Empty.tsx           # 未使用的模板代码
├── hooks/
│   ├── useScrollReveal.ts  # IntersectionObserver 滚动可见性
│   └── useTheme.ts         # 主题 hook
├── lib/
│   └── utils.ts            # cn() 工具函数
├── pages/
│   └── Home.tsx            # 首页（组合所有区块）
├── App.tsx                 # 根组件
├── main.tsx                # 入口文件
├── index.css               # 全局样式 + Tailwind 指令
└── vite-env.d.ts
```

### 页面区块（单页锚点导航）

| 区块 | 锚点 ID | 组件 |
|------|---------|------|
| 导航栏 | - | Navbar |
| 首屏 | `#hero` | Hero |
| 功能特色 | `#features` | Features |
| 数据统计 | - | Stats |
| 界面预览 | `#preview` | Preview |
| 下载区域 | `#download` | Download |
| 页脚 | - | Footer |

---

## 网站所有链接清单

### 内部锚点链接
| 链接文本 | 目标 |
|----------|------|
| Logo "Quiddity" | `#hero` |
| 首页 | `#hero` |
| 功能 | `#features` |
| 预览 | `#preview` |
| 下载 | `#download` |
| 了解更多 | `#features` |

### 外部链接
| 链接文本 | URL | 新标签 |
|----------|-----|--------|
| GitHub | https://github.com/jiuan-9/quiddity-website | 是 |
| Release | https://github.com/jiuan-9/quiddity-website/releases | 是 |
| Issues | https://github.com/jiuan-9/quiddity-website/issues | 是 |
| 邮箱 | mailto:jiu0919@agent.qq.com | - |
| Windows 下载 | https://github.com/jiuan-9/quiddity-website/releases/download/v1.0.0/Quiddity-1.0.0.exe | - |

---

## 设计规范

- **主色调**：深空蓝黑 `#0a0e1a` 底色，科技蓝渐变 `#4facfe → #00f2fe`
- **字体**：PingFang SC / Microsoft YaHei / Noto Sans SC
- **布局**：单页面滚动，桌面端优先（1920/1440/1024px 断点）
- **动效**：滚动触发淡入上浮、数字计数滚动、卡片悬停上浮、CTA 按钮呼吸效果
- **自定义 CSS 类**：
  - `.glass`：玻璃态半透明背景 + 模糊
  - `.text-gradient`：渐变文字
  - `.glow-border`：发光边框

---

## 部署信息

- **部署平台**：GitHub Pages
- **部署分支**：main
- **部署目录**：/docs
- **推送即部署**：git push 到 main 分支后自动生效
- **部署流水线**：`npm run build` → git add → git commit → git push

---

## 数据准确性说明

以下数据从Quiddity桌面应用源码 (`d:\Quiddity\src\renderer\settings.js`) 的 `AI_PROVIDERS` 数组中实际统计得出：

| 数据项 | 数值 | 来源 |
|--------|------|------|
| 服务商数 | 11 家 | `AI_PROVIDERS` 数组长度 |
| 模型总数 | 62 个 | 各服务商 `models` 数组求和 |
| 会话限制 | 无限制 | `createConversation()` 无上限检查 |
| 数据存储 | 本地加密 | `encryptKey()` 加密写入本地文件 |

如需更新统计数字，请重新统计 `AI_PROVIDERS` 中服务商和模型的实际数量。
