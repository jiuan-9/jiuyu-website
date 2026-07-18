# Quiddity Deploy Dashboard

一个本地 GUI 工具，用于查看 quiddity-website 仓库的实时 GitHub 数据并一键推送更新。

## 功能

### Dashboard 页
- 实时显示 GitHub 数据：Stars / Forks / Open Issues / 总下载量
- 最新 Release 信息（版本号、发布日期、资产清单、单版本下载量）
- 最近推送时间和默认分支
- 资产清单（每个安装包的下载量、大小、URL）
- API 速率限制状态
- 每 5 分钟自动刷新一次

### Deploy 页
- Commit 信息输入框
- 选项：是否构建网站 / 是否运行测试
- 单步操作按钮：
  - `同步数据` — 调用 `npm run sync:downloads`
  - `查看 Git 状态` — `git status --short`
  - `仅构建` — `npm run build`
  - `最近 commit` — `git log --oneline -10`
- `🚀 一键推送` — 按顺序执行：
  1. `npm run sync:downloads`
  2. `npm run sync:version`
  3. （可选）`npm run test`
  4. （可选）`npm run build`
  5. `git add .`
  6. `git commit -m "<message>"`
  7. `git push origin <current-branch>`

### Announcements 页
- 左：现有公告列表（按日期倒序，支持按分类筛选）
- 右：新增公告表单（标题 / 日期 / 标签 / 内容）
- 一键保存到 `public/announcements.json`
- 支持删除公告

### Logs 页
- 持久日志区（不会因切换页面而清空）
- 所有操作步骤都实时显示

## 启动

### 方式 1：双击启动（推荐）
```
双击 start.bat
```
首次运行会自动安装依赖（customtkinter、requests）。

### 方式 2：命令行启动
```powershell
cd D:\quiddity-website\tools\quiddity-deploy
pip install -r requirements.txt
python main.py
```

## 配置 GitHub Token（可选）

未认证时 GitHub API 限速为 60 次/小时/IP，已认证为 5000 次/小时。

**两种方式注入 Token**：

1. **GUI 内配置**（推荐）：启动后点击左下角 `⚙ GitHub Token` 按钮，粘贴 Token。
   - 仅在当前会话有效，关闭程序后失效
   - 适合临时使用

2. **环境变量**（持久）：
   ```powershell
   $env:GITHUB_TOKEN = "ghp_xxxxxxxxxxxx"
   python main.py
   ```
   或在系统环境变量中设置 `GITHUB_TOKEN`。

获取 Token：https://github.com/settings/tokens/new?scopes=public_repo

## 常见问题

### Q: 启动后看到 "未找到 Python"？
A: 安装 Python 3.10+，并在安装时勾选 "Add Python to PATH"。

### Q: GitHub 数据显示 "速率限制已耗尽"？
A: 配置 GitHub Token（见上），或等 1 小时后重试。

### Q: 一键推送时报 "未找到项目根目录"？
A: 设置环境变量 `QUIDDITY_WEBSITE_ROOT` 指向 quiddity-website 目录。
   默认会自动探测（程序在 `<root>/tools/quiddity-deploy/` 下时）。

### Q: 推送时 git push 失败，提示权限错误？
A: 这是 git/SSH 凭证问题，不是本程序问题。
   - 用 HTTPS + PAT：`git remote set-url origin https://<token>@github.com/jiuan-9/quiddity-website.git`
   - 或配置 SSH key

## 文件结构

```
quiddity-deploy/
├── main.py              # GUI 主程序（CustomTkinter）
├── github_client.py     # GitHub REST API 封装（纯标准库）
├── deployer.py          # 部署流程封装（subprocess）
├── requirements.txt     # 依赖
├── start.bat            # Windows 启动脚本
└── README.md            # 本文档
```

## 技术栈

- Python 3.10+
- CustomTkinter 5.2+（GUI 框架）
- 标准库：urllib / subprocess / threading / queue / json / pathlib

## 设计原则

1. **可靠**：所有长操作在子线程执行，UI 永不卡死；每步都有 try/except；失败时给出明确错误
2. **反馈性高**：实时日志输出；按钮状态变化；进度可见
3. **确定能用**：自动探测项目根目录；自动安装依赖；不依赖环境变量
4. **数据真实**：直接从 GitHub API 拉取，无中间缓存
