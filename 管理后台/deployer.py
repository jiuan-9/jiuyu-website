"""
deployer — 部署流程封装（Quiddity-Agent Admin 专用）

提供：
  - sync_downloads() / sync_version() / build_website() / run_tests()
  - git_status() / git_add_all() / git_commit() / git_push()
  - 公告管理：通过 announcements.AnnouncementStore

特点：
  - 项目根目录由调用方传入，不硬编码
  - 所有命令在子进程中执行，stdout/stderr 实时通过回调推送
  - 跨平台兼容（Windows 使用 PowerShell 友好的可执行文件解析）
"""

from __future__ import annotations

import json
import os
import shutil
import subprocess
from dataclasses import dataclass
from pathlib import Path
from typing import Callable


LogCallback = Callable[[str], None]


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
    env["PYTHONIOENCODING"] = "utf-8"
    env["PYTHONUTF8"] = "1"
    env["FORCE_COLOR"] = "0"
    env["NO_COLOR"] = "1"
    return env


def resolve_executable(name: str) -> str | None:
    """跨平台解析 npm / npx / node / git 可执行文件"""
    exe = shutil.which(name)
    if exe:
        return exe
    if os.name == "nt":
        for ext in (".cmd", ".bat", ".exe"):
            exe = shutil.which(name + ext)
            if exe:
                return exe
    return None


def run_command(
    args: list[str],
    cwd: Path,
    log: LogCallback | None = None,
    timeout: int = 600,
) -> CommandResult:
    """在子进程中执行命令，stdout/stderr 实时通过 log 回调推送"""
    if not cwd.is_dir():
        msg = f"工作目录不存在：{cwd}"
        if log:
            log(f"[ERROR] {msg}\n")
        return CommandResult(returncode=1, stderr=msg)

    if args[0] in ("npm", "npx", "node", "git"):
        exe = resolve_executable(args[0])
        if exe:
            args = [exe] + args[1:]

    try:
        proc = subprocess.Popen(
            args,
            cwd=str(cwd),
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            encoding="utf-8",
            errors="replace",
            env=_make_env(),
            bufsize=1,
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


def sync_downloads(project_root: Path, log: LogCallback | None = None) -> CommandResult:
    if log:
        log("\n→ [同步] npm run sync:downloads\n")
    return run_command(["npm", "run", "sync:downloads"], cwd=project_root, log=log, timeout=60)


def sync_version(project_root: Path, log: LogCallback | None = None) -> CommandResult:
    if log:
        log("\n→ [同步] npm run sync:version\n")
    return run_command(["npm", "run", "sync:version"], cwd=project_root, log=log, timeout=60)


def build_website(project_root: Path, log: LogCallback | None = None) -> CommandResult:
    if log:
        log("\n→ [构建] npm run build\n")
    return run_command(["npm", "run", "build"], cwd=project_root, log=log, timeout=300)


def run_tests(project_root: Path, log: LogCallback | None = None) -> CommandResult:
    if log:
        log("\n→ [测试] npm run test\n")
    return run_command(["npm", "run", "test"], cwd=project_root, log=log, timeout=120)


def git_status(project_root: Path, log: LogCallback | None = None) -> CommandResult:
    if log:
        log("\n→ [Git] git status --short\n")
    return run_command(["git", "status", "--short"], cwd=project_root, log=log, timeout=15)


def git_add_all(project_root: Path, log: LogCallback | None = None) -> CommandResult:
    if log:
        log("\n→ [Git] git add .\n")
    return run_command(["git", "add", "."], cwd=project_root, log=log, timeout=15)


def git_commit(project_root: Path, message: str, log: LogCallback | None = None) -> CommandResult:
    if not message.strip():
        msg = "[ERROR] commit message 不能为空"
        if log:
            log(msg + "\n")
        return CommandResult(returncode=1, stderr=msg)
    if log:
        log(f"\n→ [Git] git commit -m {message!r}\n")
    return run_command(["git", "commit", "-m", message], cwd=project_root, log=log, timeout=30)


def git_push(project_root: Path, log: LogCallback | None = None) -> CommandResult:
    branch_result = run_command(
        ["git", "rev-parse", "--abbrev-ref", "HEAD"],
        cwd=project_root,
        log=None,
        timeout=10,
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
    return run_command(["git", "push", "origin", branch], cwd=project_root, log=log, timeout=120)


def git_log_recent(project_root: Path, n: int = 5, log: LogCallback | None = None) -> CommandResult:
    if log:
        log(f"\n→ [Git] git log --oneline -{n}\n")
    return run_command(["git", "log", "--oneline", f"-{n}"], cwd=project_root, log=log, timeout=10)


def full_deploy(
    project_root: Path,
    commit_message: str,
    log: LogCallback | None = None,
    skip_build: bool = False,
    skip_tests: bool = True,
) -> bool:
    """一键推送流程

    sync_downloads / sync_version 失败时降级为警告（不中止），
    因为 public/downloads.json + version.json 已有上次同步的真实数据可用。
    其他步骤失败才中止。
    """
    # sync 步骤失败时降级（网络问题不阻塞推送）
    soft_fail_steps = {"同步下载资产", "同步版本号"}

    steps = [
        ("同步下载资产", lambda: sync_downloads(project_root, log=log)),
        ("同步版本号", lambda: sync_version(project_root, log=log)),
    ]
    if not skip_tests:
        steps.append(("运行测试", lambda: run_tests(project_root, log=log)))
    if not skip_build:
        steps.append(("构建网站", lambda: build_website(project_root, log=log)))
    steps.extend([
        ("Git Add", lambda: git_add_all(project_root, log=log)),
        ("Git Commit", lambda: git_commit(project_root, commit_message, log=log)),
        ("Git Push", lambda: git_push(project_root, log=log)),
    ])

    for name, fn in steps:
        if log:
            log(f"\n{'=' * 60}\n▶ 步骤：{name}\n{'=' * 60}\n")
        result = fn()
        if not result.success:
            if name in soft_fail_steps:
                # 网络同步失败：降级跳过，用已有数据继续
                if log:
                    log(
                        f"\n[WARN] 步骤 '{name}' 失败，但已降级跳过（用 public/ 下已有数据继续）\n"
                    )
                continue
            if log:
                log(f"\n[FAILED] 步骤 '{name}' 失败（returncode={result.returncode}）\n")
            return False
        if log:
            log(f"\n[OK] 步骤 '{name}' 完成\n")

    if log:
        log("\n" + "=" * 60 + "\n")
        log("全部步骤完成！\n")
        log("=" * 60 + "\n")
    return True


def load_settings_json(path: Path) -> dict:
    """加载任意 JSON 设置文件（用于预览版本/下载数据）"""
    if not path.exists():
        return {}
    try:
        raw = path.read_text(encoding="utf-8")
        if raw and raw[0] == "\ufeff":
            raw = raw[1:]
        return json.loads(raw)
    except json.JSONDecodeError as e:
        raise ValueError(f"{path.name} 解析失败：{e}")