# Quiddity Admin

Quiddity 官网独立桌面管理后台。替代原网站内的 `/admin` 路由，提供公告管理、GitHub 数据查看和一键部署功能。

## 功能

- **Dashboard**：实时查看 GitHub 仓库数据（Stars / Forks / Issues / 总下载量 / 最新 Release / 资产清单）
- **Announcements**：增删查改 `public/announcements.json`
- **Deploy**：同步 Release 数据、构建网站、查看 Git 状态、一键推送
- **Settings**：配置项目根目录、GitHub 仓库、Token、窗口尺寸
- **Logs**：持久化操作日志

## 环境要求

- Windows 10/11
- Python 3.10+
- 已安装 `customtkinter`

## 安装

```bash
cd "D:\quiddity-website\管理后台"
pip install -r requirements.txt
```

## 启动

方式一：双击网站根目录的 `启动管理后台.bat`

方式二：直接进本目录双击 `start.bat`

方式三：命令行

```bash
cd "D:\quiddity-website\管理后台"
python main.py
```

## 首次使用

1. 启动后进入 **Settings** 页
2. 确认「项目根目录」指向 `D:\quiddity-website`（或你的官网仓库目录）
3. （可选）填写 GitHub 仓库名和 Personal Access Token，提升 API 配额
4. 点击「保存设置」
5. 切换到 **Dashboard** 页，点击「刷新数据」测试 GitHub 连接

## 发布一条公告

1. 切换到 **Announcements** 页
2. 选择分类：`important` 或 `latest`
3. 填写标题、日期、标签、内容
4. 点击「保存到 announcements.json」
5. 切换到 **Deploy** 页，输入 commit 信息，点击「一键推送」

## 一键部署

在 **Deploy** 页：

1. 输入 commit 信息
2. 勾选是否需要「构建网站」和「运行测试」
3. 点击「一键推送」
4. 确认弹窗后，程序会自动执行：
   - `npm run sync:downloads`
   - `npm run sync:version`
   - 可选 `npm run test`
   - 可选 `npm run build`
   - `git add .`
   - `git commit -m "..."`
   - `git push`

## 配置文件

配置保存在 `%LOCALAPPDATA%\QuiddityAdmin\config.json`，首次启动会自动创建。

## 文件说明

| 文件 | 说明 |
|------|------|
| `main.py` | 主程序入口 |
| `config_store.py` | 配置读取/保存 |
| `github_client.py` | GitHub API 封装 |
| `announcements.py` | 公告数据管理 |
| `deployer.py` | 部署命令封装 |
| `self_check.py` | 模块自检脚本 |
| `start.bat` | Windows 启动脚本 |
| `requirements.txt` | Python 依赖 |
