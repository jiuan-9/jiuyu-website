"""
deployer — 部署流程封装

提供：
  - sync_downloads()：调用 npm run sync:downloads
  - sync_version()：调用 npm run sync:version
  - build_website()：调用 npm run build
  - git_status() / git_add_all() / git_commit() / git_push()
  - run_tests()：调用 npm run test
  - 公告管理：load_announcements() / save_announcement() / list_announcements()

所有命令在子进程中执行，stdout/stderr 实时通过回调推送给 UI。
跨平台兼容（Windows 使用 PowerShell）。
"""

from __future__ import annotations

import json
import os
import subprocess
import sys
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Callable, Optional


# ====================================================================
# 路径与常量
# ====================================================================

# 工具自身路径
TOOL_DIR = Path(__file__).resolve().parent

# 推断 quiddity-website 项目根目录（工具在 <root>/tools/quiddity-deploy/ 下）
def _detect_project_root() -> Path:
    """自动探测 quiddity-website 项目根目录"""
    # 优先：环境变量
    env_root = os.environ.get("QUIDDITY_WEBSITE_ROOT")
    if env_root and Path(env_root).is_dir():
        return Path(env_root).resolve()

    # 默认：TOOL_DIR/../../  （tools/quiddity-deploy → 项目根）
    candidate = TOOL_DIR.parent.parent
    if (candidate / "package.json").is_file():
        return candidate.resolve()

    # 兜底：硬编码
    fallback = Path("D:/quiddity-website")
    if fallback.is_dir():
        return fallback.resolve()

    raise FileNotFoundError(
        "无法自动探测 quiddity-website 项目根目录。"
        "请设置环境变量 QUIDDITY_WEBSITE_ROOT。"
    )


PROJECT_ROOT = _detect_project_root()
PUBLIC_DIR = PROJECT_ROOT / "public"
ANNOUNCEMENTS_FILE = PUBLIC_DIR / "announcements.json"


# ====================================================================
# 日志回调类型
# ====================================================================

LogCallback = Callable[[str], None]


# ====================================================================
# 命令执行
# ====================================================================

@dataclass
class CommandResult:
    """命令执行结果"""
    returncode: int
    stdout: str = ""
    stderr: str = ""

    @property
    def success(self) -> bool:
        return self.returncode == 0


def _make_env() -> dict[str, str]:
    """构造子进程环境变量（继承当前环境 + 强制 UTF-8 输出）"""
    env = os.environ.copy()
    # Node.js / npm 在 Windows 上默认 GBK 输出，强制 UTF-8 避免乱码
    env["PYTHONIOENCODING"] = "utf-8"
    env["PYTHONUTF8"] = "1"
    env["FORCE_COLOR"] = "0"  # 禁用颜色代码（日志区不需要）
    env["NO_COLOR"] = "1"
    return env


def run_command(
    args: list[str],
    cwd: Path = PROJECT_ROOT,
    log: LogCallback | None = None,
    timeout: int = 600,
) -> CommandResult:
    """
    在子进程中执行命令，stdout/stderr 实时通过 log 回调推送

    参数：
      args: 命令列表（如 ["npm", "run", "build"]）
      cwd: 工作目录（默认 PROJECT_ROOT）
      log: 日志回调（每个 chunk 调用一次）
      timeout: 超时（秒），默认 10 分钟
    """
    # Windows 上需要 shell=False 但要找对 npm.cmd
    # 用 shutil.which 解析可执行文件
    import shutil

    if args[0] in ("npm", "npx", "node", "git"):
        exe = shutil.which(args[0])
        if exe is None:
            # Windows：尝试 .cmd / .bat
            for ext in (".cmd", ".bat", ".exe"):
                exe = shutil.which(args[0] + ext)
                if exe:
                    break
        if exe:
            args = [exe] + args[1:]

    try:
        # 关键：text=True + encoding=utf-8 + errors=replace
        # 避免 Windows GBK 编码崩溃
        proc = subprocess.Popen(
            args,
            cwd=str(cwd),
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,  # 合并 stderr 到 stdout（简化处理）
            text=True,
            encoding="utf-8",
            errors="replace",
            env=_make_env(),
            bufsize=1,  # 行缓冲
        )
    except FileNotFoundError as e:
        msg = f"命令未找到：{args[0]}（{e}）"
        if log:
            log(f"[ERROR] {msg}\n")
        return CommandResult(returncode=127, stderr=msg)

    output_lines: list[str] = []
    try:
        assert proc.stdout is not None
        for line in proc.stdout:
            output_lines.append(line)
            if log:
                log(line)
        proc.wait(timeout=timeout)
    except subprocess.TimeoutExpired:
        proc.kill()
        proc.wait()
        msg = f"\n[ERROR] 命令超时（{timeout}s）：{' '.join(args)}\n"
        output_lines.append(msg)
        if log:
            log(msg)
        return CommandResult(
            returncode=124,
            stdout="".join(output_lines),
            stderr="timeout",
        )

    output = "".join(output_lines)
    return CommandResult(returncode=proc.returncode, stdout=output)


# ====================================================================
# 部署操作
# ====================================================================

def sync_downloads(log: LogCallback | None = None) -> CommandResult:
    """运行 npm run sync:downloads（从 GitHub Releases 拉取最新资产信息）"""
    if log:
        log("\n→ [同步] npm run sync:downloads\n")
    return run_command(["npm", "run", "sync:downloads"], log=log, timeout=60)


def sync_version(log: LogCallback | None = None) -> CommandResult:
    """运行 npm run sync:version（全量同步版本号 + 资产 + 发布说明）"""
    if log:
        log("\n→ [同步] npm run sync:version\n")
    return run_command(["npm", "run", "sync:version"], log=log, timeout=60)


def build_website(log: LogCallback | None = None) -> CommandResult:
    """运行 npm run build（tsc + vite build）"""
    if log:
        log("\n→ [构建] npm run build\n")
    return run_command(["npm", "run", "build"], log=log, timeout=300)


def run_tests(log: LogCallback | None = None) -> CommandResult:
    """运行 npm run test（vitest run）"""
    if log:
        log("\n→ [测试] npm run test\n")
    return run_command(["npm", "run", "test"], log=log, timeout=120)


def git_status(log: LogCallback | None = None) -> CommandResult:
    """git status --short"""
    if log:
        log("\n→ [Git] git status --short\n")
    return run_command(["git", "status", "--short"], log=log, timeout=15)


def git_add_all(log: LogCallback | None = None) -> CommandResult:
    """git add ."""
    if log:
        log("\n→ [Git] git add .\n")
    return run_command(["git", "add", "."], log=log, timeout=15)


def git_commit(message: str, log: LogCallback | None = None) -> CommandResult:
    """git commit -m <message>"""
    if not message.strip():
        msg = "[ERROR] commit message 不能为空"
        if log:
            log(msg + "\n")
        return CommandResult(returncode=1, stderr=msg)
    if log:
        log(f"\n→ [Git] git commit -m {message!r}\n")
    return run_command(
        ["git", "commit", "-m", message], log=log, timeout=30
    )


def git_push(log: LogCallback | None = None) -> CommandResult:
    """git push origin <current-branch>"""
    # 先获取当前分支
    branch_result = run_command(
        ["git", "rev-parse", "--abbrev-ref", "HEAD"], log=None, timeout=10
    )
    if not branch_result.success:
        if log:
            log("[ERROR] 无法获取当前分支名\n")
        return branch_result

    branch = branch_result.stdout.strip()
    if not branch or branch == "HEAD":
        if log:
            log("[ERROR] 当前处于 detached HEAD 状态，无法 push\n")
        return CommandResult(returncode=1, stderr="detached HEAD")

    if log:
        log(f"\n→ [Git] git push origin {branch}\n")
    return run_command(
        ["git", "push", "origin", branch], log=log, timeout=120
    )


def git_log_recent(n: int = 5, log: LogCallback | None = None) -> CommandResult:
    """git log --oneline -n"""
    if log:
        log(f"\n→ [Git] git log --oneline -{n}\n")
    return run_command(
        ["git", "log", "--oneline", f"-{n}"], log=log, timeout=10
    )


# ====================================================================
# 公告管理
# ====================================================================

@dataclass
class AnnouncementItem:
    """单条公告"""
    id: int
    title: str
    content: str
    date: str  # YYYY-MM-DD
    tag: str = ""

    def to_dict(self) -> dict:
        d = {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "date": self.date,
        }
        if self.tag:
            d["tag"] = self.tag
        return d

    @classmethod
    def from_dict(cls, d: dict) -> "AnnouncementItem":
        return cls(
            id=int(d.get("id", 0)),
            title=d.get("title", ""),
            content=d.get("content", ""),
            date=d.get("date", ""),
            tag=d.get("tag", ""),
        )


def load_announcements() -> dict[str, list[AnnouncementItem]]:
    """
    加载 announcements.json

    返回：{"important": [...], "latest": [...]}
    """
    if not ANNOUNCEMENTS_FILE.exists():
        return {"important": [], "latest": []}

    try:
        # 兼容 BOM
        raw = ANNOUNCEMENTS_FILE.read_text(encoding="utf-8")
        if raw and raw[0] == "\ufeff":
            raw = raw[1:]
        data = json.loads(raw)
    except json.JSONDecodeError as e:
        raise ValueError(f"announcements.json 解析失败：{e}")

    return {
        "important": [
            AnnouncementItem.from_dict(x)
            for x in data.get("important", [])
        ],
        "latest": [
            AnnouncementItem.from_dict(x)
            for x in data.get("latest", [])
        ],
    }


def save_announcements(
    important: list[AnnouncementItem],
    latest: list[AnnouncementItem],
) -> None:
    """保存到 announcements.json"""
    data = {
        "important": [item.to_dict() for item in important],
        "latest": [item.to_dict() for item in latest],
    }
    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)
    ANNOUNCEMENTS_FILE.write_text(
        json.dumps(data, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )


def add_announcement(
    category: str,
    title: str,
    content: str,
    tag: str = "",
    date: str | None = None,
) -> AnnouncementItem:
    """
    向指定分类添加一条公告

    category: "important" 或 "latest"
    返回：新创建的 AnnouncementItem
    """
    if category not in ("important", "latest"):
        raise ValueError(f"无效的分类：{category}（必须为 important 或 latest）")
    if not title.strip():
        raise ValueError("标题不能为空")
    if not content.strip():
        raise ValueError("内容不能为空")

    data = load_announcements()
    existing = data[category]

    # 生成新 id（取最大 id + 1）
    next_id = max((item.id for item in existing), default=0) + 1

    item = AnnouncementItem(
        id=next_id,
        title=title.strip(),
        content=content.strip(),
        date=date or datetime.now().strftime("%Y-%m-%d"),
        tag=tag.strip(),
    )
    existing.append(item)
    data[category] = existing
    save_announcements(data["important"], data["latest"])
    return item


def delete_announcement(category: str, announcement_id: int) -> bool:
    """删除指定公告，返回是否成功删除"""
    data = load_announcements()
    existing = data[category]
    before = len(existing)
    data[category] = [x for x in existing if x.id != announcement_id]
    if len(data[category]) == before:
        return False
    save_announcements(data["important"], data["latest"])
    return True


# ====================================================================
# 一键推送流程
# ====================================================================

def full_deploy(
    commit_message: str,
    log: LogCallback | None = None,
    skip_build: bool = False,
    skip_tests: bool = True,
) -> bool:
    """
    一键推送流程（按顺序执行，任一步失败即中止）：
      1. sync:downloads（同步 GitHub Releases 到 downloads.json）
      2. sync:version（同步版本号到 version.json）
      3. （可选）run_tests
      4. （可选）build_website
      5. git add .
      6. git commit -m <message>
      7. git push

    返回：所有步骤是否都成功
    """
    steps: list[tuple[str, Callable[[], CommandResult]]] = []

    steps.append(("同步下载资产", sync_downloads))
    steps.append(("同步版本号", sync_version))
    if not skip_tests:
        steps.append(("运行测试", run_tests))
    if not skip_build:
        steps.append(("构建网站", build_website))
    steps.append(("Git Add", git_add_all))
    steps.append(("Git Commit", lambda: git_commit(commit_message)))
    steps.append(("Git Push", git_push))

    for name, fn in steps:
        if log:
            log(f"\n{'=' * 60}\n▶ 步骤：{name}\n{'=' * 60}\n")
        result = fn(log=log)
        if not result.success:
            if log:
                log(
                    f"\n[FAILED] 步骤 '{name}' 失败"
                    f"（returncode={result.returncode}）\n"
                )
            return False
        if log:
            log(f"\n[OK] 步骤 '{name}' 完成\n")

    if log:
        log("\n" + "=" * 60 + "\n")
        log("🎉 全部步骤完成！\n")
        log("=" * 60 + "\n")
    return True


# ====================================================================
# 工具：测试自身（python deployer.py selftest）
# ====================================================================

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "selftest":
        print(f"PROJECT_ROOT = {PROJECT_ROOT}")
        print(f"PUBLIC_DIR = {PUBLIC_DIR}")
        print(f"ANNOUNCEMENTS_FILE = {ANNOUNCEMENTS_FILE}")
        print(f"exists(package.json) = {(PROJECT_ROOT / 'package.json').is_file()}")
        print(f"exists(announcements.json) = {ANNOUNCEMENTS_FILE.is_file()}")
        if ANNOUNCEMENTS_FILE.is_file():
            data = load_announcements()
            print(f"important: {len(data['important'])} 条")
            print(f"latest: {len(data['latest'])} 条")
            for item in data["important"][:3]:
                print(f"  - [{item.id}] {item.title} ({item.date})")
    elif len(sys.argv) > 1 and sys.argv[1] == "git-status":
        r = git_status(lambda s: print(s, end=""))
        print(f"\nreturncode = {r.returncode}")
    elif len(sys.argv) > 1 and sys.argv[1] == "git-log":
        r = git_log_recent(log=lambda s: print(s, end=""))
        print(f"\nreturncode = {r.returncode}")
